import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from '../entities/user.entity';
import { LoginOutput } from './login.dto';

@InputType()
export class RefreshTokenInput extends PickType(RefreshToken, [
  'refresh_token',
]) {}

@ObjectType()
export class RefreshTokenOutput extends LoginOutput {}
