import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password', 'birth', 'bio', 'name']),
) {
  @Field((type) => String, { nullable: true })
  oldPassword?: string;
}

/**
 * Combine PickType and PartialType
 *
 * 1. PickType - make class with email and pw in User
 * 2. PartialType - make them optional
 */
