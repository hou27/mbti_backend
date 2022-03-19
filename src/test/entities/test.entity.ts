import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@InputType('TestInputType', { isAbstract: true }) // isAbstract : do not add to Schema
@ObjectType()
@Entity()
export class Test extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  mbti: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.myResult, {
    onDelete: 'CASCADE', // if the user is deleted, then also going to delete test result.
    nullable: false,
  })
  user: User;

  @RelationId((test: Test) => test.user) // Loads id (or ids) of specific relations into properties. For example, if you have a many-to-one category in your Post entity, you can have a new category id by marking a new property with @RelationId.
  userId: number;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.userList, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  tester?: User;

  @RelationId((test: Test) => test.tester)
  testerId: number;

  @Field((type) => String, { nullable: true })
  @Column()
  nonMemberNickname?: string;
}
