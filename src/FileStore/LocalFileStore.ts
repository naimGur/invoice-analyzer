import { Injectable } from '@nestjs/common';
import { FileStore } from './index';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const mkdir = util.promisify(fs.mkdir);

@Injectable()
export class LocalFileStore implements FileStore {
  private readonly uploadDir = 'uploads';
  private readonly filePath = path.join(this.uploadDir, 'transactionFile.csv');

  constructor() {
    this.ensureUploadsDirExists();
  }

  private async ensureUploadsDirExists(): Promise<void> {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create uploads directory:', error);
      throw error;
    }
  }

  async writeFile(file: Buffer): Promise<void> {
    await this.ensureUploadsDirExists();
    await writeFile(this.filePath, file);
  }

  async readFile(): Promise<Record<string, string>[]> {
    await this.ensureUploadsDirExists();

    try {
      const fileContent = await readFile(this.filePath, 'utf-8');

      const lines = fileContent
        .split('\n')
        .filter((line) => line.trim() !== '');

      const headers = lines[0].split(',').map((header) => header.trim());

      const result = lines.slice(1).map((line) => {
        const values = line.split(',').map((value) => value.trim());
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        return row;
      });

      return result;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error('File not found:', this.filePath);
        return [];
      }
      throw error;
    }
  }
}
