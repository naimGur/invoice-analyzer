import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';
import { FileModule } from '../file/file.module';
import { ChatGPTAnalyzer } from '../../Analyze/ChatGPT';

@Module({
  imports: [FileModule],
  controllers: [AnalyzeController],
  providers: [
    AnalyzeService,
    {
      provide: 'Analyze',
      useClass: ChatGPTAnalyzer,
    },
  ],
})
export class AnalyzeModule {}
