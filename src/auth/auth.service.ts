import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt/jwt.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions,
  ) {}

  signAccessToken(
    userId: number,
    /*payload: object*/
  ): string {
    return jwt.sign({ id: userId }, this.options.accessTokenPrivateKey, {
      expiresIn: '15m',
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
}
