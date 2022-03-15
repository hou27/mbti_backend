import { InputType, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class meOutput extends OmitType(User, ['password']) {}

@InputType()
export class FindByEmailInput extends PickType(User, ['email']) {}
