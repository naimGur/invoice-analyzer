import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileModule } from './services/file/file.module';
import { AnalyzeModule } from './services/analyze/analyze.module';

@Module({
  imports: [FileModule, AnalyzeModule],
  controllers: [AppController],
})
export class AppModule {}
