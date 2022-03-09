import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsString } from 'class-validator';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

registerEnumType(Gender, { name: 'Gender' }); // for graphql

// Fix err : Schema must contain uniquely named types but contains multiple types named "User".
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  profileImg: string;

  @Field((type) => String)
  @Column({ unique: true }) // email should be unique.
  @IsEmail()
  email: string;

  @Field((type) => Gender)
  @Column({ type: 'enum', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @Field((type) => String)
  @Column({ select: false }) // 1. do not select pw(solve rehash problem)
  @IsString()
  password: string;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true })
  @IsDate()
  birth: Date;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  bio: string;

  @BeforeInsert() // Entity Listener
  @BeforeUpdate() // password need to hashed before save.
  async hashPassword(): Promise<void> {
    if (this.password) {
      // 2. hash the password if there is a pw in the object that give to save
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(plainPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
