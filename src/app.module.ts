import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { ApolloDriver } from '@nestjs/apollo';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { JwtModule } from './jwt/jwt.module';
import { User } from './users/entities/user.entity';
import { TestsModule } from './tests/tests.module';
import { Test } from './tests/entities/test.entity';
import { RefreshToken } from './users/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // application 어디서나 config module에 접근 가능하도록.
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // deploy할 때 env파일을 사용하지 않는 옵션
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PW: Joi.string(),
        DB_NAME: Joi.string(),
        ACCESS_TOKEN_PRIVATE_KEY: Joi.string().required(),
        REFRESH_TOKEN_PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
        KAKAO_REST_API_KEY: Joi.string().required(),
        REDIRECT_URI_LOGIN: Joi.string().required(),
        KAKAO_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PW,
            database: process.env.DB_NAME,
          }),
      synchronize: /*process.env.NODE_ENV !== 'prod'*/ true,
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User, Test, RefreshToken],
      /* <----- Add SSL option */
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }),
    GraphQLModule.forRoot({
      playground: process.env.NODE_ENV !== 'prod',
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: async ({ req }) => ({ user: req['user'] }), // context is called each req.
    }),
    JwtModule.forRoot({
      accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    }),
    UsersModule,
    TestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
