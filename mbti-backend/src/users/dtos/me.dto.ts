import { ObjectType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class meOutput extends OmitType(User, ['password']) {}
