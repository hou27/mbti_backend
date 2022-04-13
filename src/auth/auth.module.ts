import { DynamicModule, forwardRef, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModuleOptions } from './jwt/jwt.interfaces';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      }),
    }),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
@Global()
export class AuthModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        AuthService,
      ],
      exports: [AuthService],
    };
  }
}
