import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Test } from './entities/test.entity';
import { TestResolver } from './tests.resolver';
import { TestService } from './tests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Test, User])],
  providers: [TestResolver, TestService],
})
export class TestsModule {}
