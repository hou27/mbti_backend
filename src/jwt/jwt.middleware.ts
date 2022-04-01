import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from 'got/dist/source';
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
          ok ? (req['user'] = user) : null; // findById return 값 변화에 따른 수정
        }
      } catch (e) {
        // console.log(e);
        throw new HttpException(
          {
            ok: false,
            error: 'INVALID TOKEN',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    next();
  }
}
