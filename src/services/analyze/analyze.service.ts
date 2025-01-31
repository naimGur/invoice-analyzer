import { Injectable, Inject } from '@nestjs/common';
import { Analyze } from '../../Analyze';
import { FileService } from '../file/file.service';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly fileService: FileService,
    @Inject('Analyze') private readonly analyzer: Analyze,
  ) {}

  async analyzeMerchant() {
    const transactions = await this.fileService.getFile();
    return this.analyzer.merchants(transactions);
  }

  async analyzePatterns() {
    const transactions = await this.fileService.getFile();
    return this.analyzer.patterns(transactions);
  }
}
