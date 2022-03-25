import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/test/entities/test.entity';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, Test])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
