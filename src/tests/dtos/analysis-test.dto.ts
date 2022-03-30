import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';
import { Any } from 'typeorm';
import { Test } from '../entities/test.entity';

@InputType()
export class AnalysisTestInput {
  @Field((type) => Int)
  userId: number;

  @Field((type) => Int, { nullable: true })
  testerId?: number;

  @Field((type) => String)
  results: string;

  @Field((type) => String, { nullable: true })
  nonMemberNickname?: string;
}

@ObjectType()
export class AnalysisTestOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  mbti?: string;

  @Field((type) => User, { nullable: true })
  user?: User;

  @Field((type) => User, { nullable: true })
  tester?: User;

  @Field((type) => String, { nullable: true })
  nonMemberNickname?: string;
}
