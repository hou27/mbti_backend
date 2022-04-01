import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('RefreshTokenInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class RefreshToken extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  refresh_token: string;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  userId: number;
}
