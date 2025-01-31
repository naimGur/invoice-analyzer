import { Injectable, Inject } from '@nestjs/common';
import { FileStore } from '../../FileStore';

@Injectable()
export class FileService {
  constructor(@Inject('FileStore') private readonly fileStore: FileStore) {}

  async saveFile(file: Buffer): Promise<void> {
    await this.fileStore.writeFile(file);
  }

  async getFile(): Promise<Record<string, string>[]> {
    return await this.fileStore.readFile();
  }
}
