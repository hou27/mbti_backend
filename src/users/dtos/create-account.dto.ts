import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'name',
  'email',
  'password',
  'gender',
]) {}

@InputType()
export class CreateKakaoAccountInput extends PartialType(User) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
