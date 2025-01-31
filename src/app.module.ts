import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileModule } from './services/file/file.module';
import { AnalyzeModule } from './services/analyze/analyze.module'; // Import the AnalyzeModule

@Module({
  imports: [FileModule, AnalyzeModule], // Add AnalyzeModule here
  controllers: [AppController], // Keep AppController for general routes
})
export class AppModule {}
