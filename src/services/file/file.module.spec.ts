import { Test } from '@nestjs/testing';
import { FileModule } from './file.module';
import { LocalFileStore } from '../../FileStore/LocalFileStore';

describe('FileModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [FileModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get('FileStore')).toBeInstanceOf(LocalFileStore);
  });
});
