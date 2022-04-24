import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { LoginOutput } from './login.dto';

@InputType()
export class RefreshTokenInput extends PickType(User, ['refresh_token']) {}

@ObjectType()
export class RefreshTokenOutput extends LoginOutput {}
