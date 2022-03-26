import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Any } from 'typeorm';

@InputType()
export class LoginWithKakaoInput {
  @Field((type) => String)
  code: string;
}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}

@ObjectType()
export class GetAccessTokenOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  accessToken?: string;
}

ObjectType();
export class GetUserInfoOutput extends CoreOutput {
  @Field((type) => Any, { nullable: true })
  userInfo?: any;
}
