import { Controller, Post } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('merchants')
  async analyzeMerchant() {
    const result = await this.analyzeService.analyzeMerchant();
    return { message: result };
  }

  @Post('patterns')
  async analyzePatterns() {
    const result = await this.analyzeService.analyzePatterns();
    return { message: result };
  }
}
