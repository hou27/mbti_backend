import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { Test } from 'src/test/entities/test.entity';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { customUserRepositoryMethods } from './repositories/user.repository';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Test])],
  providers: [
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        // Override default repository for User with a custom one
        return dataSource
          .getRepository(User)
          .extend(customUserRepositoryMethods);
      },
    },
    UserResolver,
    UserService,
  ],
  exports: [UserService],
})
export class UsersModule {}
