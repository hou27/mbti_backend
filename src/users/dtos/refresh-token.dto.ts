import { InputType, PickType } from '@nestjs/graphql';
import { RefreshToken } from '../entities/refresh-token.entity';

@InputType()
export class RefreshTokenInput extends PickType(RefreshToken, [
  'userId',
  'refresh_token',
]) {}

/**
 * Combine PickType and PartialType
 *
 * 1. PickType - make class with email and pw in User
 * 2. PartialType - make them optional
 */
