export interface FileStore {
  writeFile(file: Buffer): Promise<void>;
  readFile(): Promise<Record<string, string>[]>;
}
