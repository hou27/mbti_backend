import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/users/users.service';
import { Payload } from './jwt.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    });
  }

  async validate(payload: Payload) {
    // guard 호출 시 해당 strategy의 validate 호출
    const { user } = await this.usersService.findById(payload.id);
    if (user) {
      console.log('user', user);
      return user; // req.user에 담기게 됨.
    } else {
      throw new UnauthorizedException('User Not Found');
    }
  }
}
