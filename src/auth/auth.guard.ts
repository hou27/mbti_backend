// import {
//   CanActivate,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
//   Injectable,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { Reflector } from '@nestjs/core';
// import { User } from 'src/users/entities/user.entity';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   // constructor(private readonly reflector: Reflector) {}
//   canActivate(context: ExecutionContext) {
//     // const roles = this.reflector.get<AllowedRoles>( // guard checks the 'metadata' of the req to see if there's a role.
//     //   'roles',
//     //   context.getHandler(),
//     // );
//     // if (!roles) {
//     //   // It means that i didn't set any metadata.
//     //   return true;
//     // }
//     const gqlContext = GqlExecutionContext.create(context).getContext(); // graphql context는 http의 context와 다르기 때문에 변환이 필요함.
//     const user: User = gqlContext['user'];
//     if (!user) {
//       // return false; // block req
//       throw new HttpException(
//         {
//           ok: false,
//           error: 'No User in req',
//         },
//         HttpStatus.UNAUTHORIZED,
//       );
//     }
//     return true; // continue req
//   }
// }
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // const gqlContext = GqlExecutionContext.create(context).getContext();

    // console.log('as', gqlContext['user']);
    // const user: User = gqlContext['user'];

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    if (err || !user) {
      // jwt expired || invalid token || No auth token || jwt malformed
      console.log(info);
      throw err || new UnauthorizedException(info);
    } else {
      return user;
    }
  }
}
