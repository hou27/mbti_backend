import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  }: AnalysisTestInput): Promise<AnalysisTestOutput> {
    try {
      const user = await this.users.findOneOrFail(userId);
      const tester = await this.users.findOneOrFail(testerId);
      // const values = Object.values(results);
      const sum = results.split('');

      const mbtiArr = [];

      +sum[0] < 5 ? mbtiArr.push('E') : mbtiArr.push('I');
      +sum[1] < 5 ? mbtiArr.push('S') : mbtiArr.push('N');
      +sum[2] < 5 ? mbtiArr.push('T') : mbtiArr.push('F');
      +sum[3] < 5 ? mbtiArr.push('J') : mbtiArr.push('P');

      const mbti = mbtiArr.join('');

      const newTest = this.tests.create({ mbti, user, tester });
      this.tests.save(newTest);

      return {
        ok: true,
        testResult: newTest,
      };
    } catch (error) {
      return { ok: false, error: 'Server Error' };
    }
  }
}
