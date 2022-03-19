import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ARRAY_MAX_SIZE } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AnalysisTestInput,
  AnalysisTestOutput,
} from './dtos/analysis-test.dto';
import { Test } from './entities/test.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly tests: Repository<Test>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async analysisTest({
    userId,
    testerId,
    results,
    nonMemberNickname,
  }: AnalysisTestInput): Promise<AnalysisTestOutput> {
    try {
      let tester: User;
      if (userId === testerId) {
        return { ok: false, error: 'You can not test yourself' };
      }
      const user = await this.users.findOne(userId, {
        relations: ['myResult', 'userList'],
      });
      if (testerId) {
        tester = await this.users.findOne(testerId, {
          relations: ['myResult', 'userList'],
        });
      }
      const sum = results.split('');

      const mbtiArr = [];

      +sum[0] < 5 ? mbtiArr.push('E') : mbtiArr.push('I');
      +sum[1] < 5 ? mbtiArr.push('S') : mbtiArr.push('N');
      +sum[2] < 5 ? mbtiArr.push('T') : mbtiArr.push('F');
      +sum[3] < 5 ? mbtiArr.push('J') : mbtiArr.push('P');

      const mbti: string = mbtiArr.join('');
      console.log(user);
      const newTest = this.tests.create({
        mbti,
        user,
        tester,
        nonMemberNickname,
      });

      const result = testerId
        ? {
            mbti,
            user,
            tester,
          }
        : {
            mbti,
            user,
            nonMemberNickname,
          };

      await this.tests.save(newTest);
      return {
        ok: true,
        ...result,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Server Error' };
    }
  }
}
