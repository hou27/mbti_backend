import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenInput } from 'src/users/dtos/refresh-token.dto';
import { LoginOutput } from 'src/users/dtos/login.dto';
import { RefreshTokenService, UserService } from 'src/users/users.service';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions,
    private readonly refreshTokensService: RefreshTokenService,
    private readonly userService: UserService,
  ) {}

  signAccessToken(
    userId: number,
    /*payload: object*/
  ): string {
    return jwt.sign({ id: userId }, this.options.accessTokenPrivateKey, {
      expiresIn: '1s',
    });
  }

  signRefreshToken(
    userId: number,
    /*payload: object*/
  ): string {
    return jwt.sign({ id: userId }, this.options.refreshTokenPrivateKey, {
      expiresIn: '24h',
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.options.accessTokenPrivateKey);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.options.refreshTokenPrivateKey);
  }

  async regenerateAccessToken({
    refresh_token,
  }: RefreshTokenInput): Promise<LoginOutput> {
    try {
      const { ok: isMatched, refreshToken } =
        await this.refreshTokensService.getRefreshToken({
          refresh_token,
        });
      const decoded = this.verifyRefreshToken(refreshToken);
      let userId;
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { ok } = await this.userService.findById(decoded['id']);
        ok ? (userId = decoded['id']) : (userId = 0);
      }
      if (isMatched) {
        if (userId !== 0) {
          const access_token = this.signAccessToken(userId);
          const refresh_token = this.signRefreshToken(userId);

          const isUpdated = await this.refreshTokensService.updateRefreshToken({
            refresh_token,
          });

          if (isUpdated) {
            return {
              ok: true,
              access_token,
              refresh_token,
            };
          } else {
            return {
              ok: false,
              error: 'Update failed',
            };
          }
        } else {
          return { ok: false, error: 'User does not exist' };
        }
      } else {
        return { ok: false, error: 'INVALID REFRESH TOKEN' };
      }
    } catch (error) {
      return { ok: false, error: 'There is no Refresh Token' };
    }
  }
}
