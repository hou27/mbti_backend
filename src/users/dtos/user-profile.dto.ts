import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Test } from 'src/test/entities/test.entity';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileInput {
  @Field((type) => Number)
  userId: number;
}

@InputType()
export class SearchUserByNameInput {
  @Field((type) => String)
  name: string;
}

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
