import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ok } from 'assert';
import {
  AnalysisTestInput,
  AnalysisTestOutput,
} from './dtos/analysis-test.dto';
import { Test } from './entities/test.entity';
import { TestService } from './test.service';

@Resolver((of) => Test)
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Mutation((returns) => AnalysisTestOutput)
  async analysisTest(
    @Args('input') analysisTestInput: AnalysisTestInput,
  ): Promise<AnalysisTestOutput> {
    return this.testService.analysisTest(analysisTestInput);
  }
}
