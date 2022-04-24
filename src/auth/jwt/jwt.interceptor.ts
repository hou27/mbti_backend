// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class JwtInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     console.log('before)');
//     // const gqlContext = GqlExecutionContext.create(context).getContext();
//     const user = context.switchToHttp().getRequest();
//     console.log('in interceptor  ');
//     console.log(user);
//     if (user) {
//       console.log('in interceptor  ');
//       console.log(user);
//       // gqlContext['user'] = user;
//     }
//     return next.handle().pipe(
//       // controller에서 반환한 값이 인자값으로 넘어옴.
//       map((returnValue) => {
//         return returnValue;
//       }),
//     );
//   }
// }
