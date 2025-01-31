import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';

describe('FileController', () => {
  let controller: FileController;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {
            saveFile: jest.fn(),
            getFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
  });

  describe('uploadFile', () => {
    it('should call saveFile with buffer and return success message', async () => {
      const mockFile = {
        buffer: Buffer.from('test content'),
      } as Express.Multer.File;

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual({ message: 'File uploaded successfully' });
      expect(fileService.saveFile).toHaveBeenCalledWith(mockFile.buffer);
    });
  });

  describe('getFile', () => {
    it('should return data from file service', async () => {
      const mockData = [
        { date: '2024-01-01', description: 'Test', amount: '10.00' },
      ];
      (fileService.getFile as jest.Mock).mockResolvedValue(mockData);

      const result = await controller.getFile();

      expect(result).toEqual(mockData);
    });
  });
});
