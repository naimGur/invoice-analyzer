import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  const mockFileStore = {
    writeFile: jest.fn(),
    readFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: 'FileStore',
          useValue: mockFileStore,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    jest.clearAllMocks();
  });

  describe('saveFile', () => {
    it('should call writeFile on the FileStore with the buffer', async () => {
      const mockBuffer = Buffer.from('test content');

      await service.saveFile(mockBuffer);

      expect(mockFileStore.writeFile).toHaveBeenCalledWith(mockBuffer);
    });

    it('should throw an error if writeFile fails', async () => {
      const mockError = new Error('Write failed');
      mockFileStore.writeFile.mockRejectedValue(mockError);

      await expect(service.saveFile(Buffer.from('test'))).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('getFile', () => {
    it('should return parsed file content from FileStore', async () => {
      const mockData = [
        { date: '2024-01-01', description: 'Test', amount: '10.00' },
      ];
      mockFileStore.readFile.mockResolvedValue(mockData);

      const result = await service.getFile();

      expect(result).toEqual(mockData);
      expect(mockFileStore.readFile).toHaveBeenCalled();
    });

    it('should throw an error if readFile fails', async () => {
      const mockError = new Error('Read failed');
      mockFileStore.readFile.mockRejectedValue(mockError);

      await expect(service.getFile()).rejects.toThrow(mockError);
    });
  });
});
