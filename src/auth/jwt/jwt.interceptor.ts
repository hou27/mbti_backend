// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { UserService } from 'src/users/users.service';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class JwtMiddleware implements NestMiddleware {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly userService: UserService,
//   ) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     console.log(req['user']);
//     if ('x-jwt' in req.headers) {
//       const token = req.headers['x-jwt'];
//       try {
//         const decoded = this.authService.verifyAccessToken(token.toString());
//         if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
//           const { user, ok } = await this.userService.findById(decoded['id']);
//           ok ? (req['user'] = user) : null; // findById return 값 변화에 따른 수정
//         }
//       } catch (error) {}
//     }
//     next();
//   }
// }

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('before)');
    // const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = context.switchToHttp().getRequest();
    if (user) {
      console.log(user);
      // gqlContext['user'] = user;
    }
    return next.handle().pipe(
      // controller에서 반환한 값이 인자값으로 넘어옴.
      map((returnValue) => {
        return returnValue;
      }),
    );
  }
}
