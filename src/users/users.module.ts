import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/tests/entities/test.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, Test, RefreshToken])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
