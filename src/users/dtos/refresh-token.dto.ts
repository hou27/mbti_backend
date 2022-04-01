import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { RefreshToken } from '../entities/refresh-token.entity';

@InputType()
export class RefreshTokenInput extends PickType(RefreshToken, [
  'refresh_token',
]) {}

@ObjectType()
export class RefreshTokenOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  refreshToken?: string;
}
