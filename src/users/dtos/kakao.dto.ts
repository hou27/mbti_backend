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
export class LoginWithKakaoInput {
  @Field((type) => String)
  code: string;
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
