import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verifyAccessToken(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user, ok } = await this.userService.findById(decoded['id']);
          ok ? (req['user'] = user) : null;
        }
      } catch (e) {
        const refreshToken = req.headers['refresh-jwt'];
        const { ok, access_token, refresh_token } =
          await this.jwtService.regenerateAccessToken({
            refresh_token: refreshToken.toString(),
          });

        if (ok === false) {
          throw new HttpException(
            {
              ok: false,
              error: 'FAILED TO UPDATE TOKEN',
            },
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          res.cookie('refresh-jwt', refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //1 day
          });
          res.cookie('access-jwt', access_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //1 day
          });
        }
      }
    }
    next();
  }
}
