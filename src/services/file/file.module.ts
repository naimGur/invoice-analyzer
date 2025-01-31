import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { LocalFileStore } from '../../FileStore/LocalFileStore';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'FileStore',
      useClass: LocalFileStore,
    },
  ],
  exports: [FileService],
})
export class FileModule {}
