import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Test } from 'src/tests/entities/test.entity';
import { User } from '../entities/user.entity';

@ArgsType()
export class FindByIdInput {
  @Field((type) => Number)
  userId: number;
}

@InputType()
export class SearchUserByNameInput {
  @Field((type) => String)
  name: string;
}

@InputType()
export class FindByEmailInput extends PickType(User, ['email']) {}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;

  @Field((type) => [Test], { nullable: true })
  myResult?: Test[];

  @Field((type) => [Test], { nullable: true })
  userList?: Test[];
}

@ObjectType()
export class SearchUserByNameOutput extends CoreOutput {
  @Field((type) => [User], { nullable: true })
  users?: User[];
}
