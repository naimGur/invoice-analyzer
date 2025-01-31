import { Injectable } from '@nestjs/common';
import { FileStore } from './index';
import * as fs from 'fs';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

@Injectable()
export class LocalFileStore implements FileStore {
  async writeFile(file: Buffer): Promise<void> {
    await writeFile(`uploads/transactionFile.csv`, file);
  }

  async readFile(): Promise<Record<string, string>[]> {
    const filePath = 'uploads/transactionFile.csv';
    const fileContent = await readFile(filePath, 'utf-8');

    const lines = fileContent.split('\n').filter((line) => line.trim() !== '');

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
  }
}
