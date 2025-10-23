import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { DatabaseService } from '../services/database.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    databaseService = module.get(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------- getCategories ----------
  describe('getCategories', () => {
    it('should return list of categories', async () => {
      const mockResponse = [{ category_uuid: '1', category_name: 'Food' }];
      databaseService.query.mockResolvedValueOnce(mockResponse);

      const result = await service.getCategories();

      expect(databaseService.query).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should throw HttpException if database returns no response', async () => {
      databaseService.query.mockResolvedValueOnce(null as any);

      await expect(service.getCategories()).rejects.toThrow(
        new HttpException(
          'Database is not giving a response',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  // ---------- createCategory ----------
  describe('createCategory', () => {
    it('should return true when insertion succeeds', async () => {
      databaseService.query.mockResolvedValueOnce([] as any);
      const result = await service.createCategory({
        category_uuid: '1',
        category_name: 'Food',
      });

      expect(result).toBe(true);
      expect(databaseService.query).toHaveBeenCalledTimes(1);
    });

    it('should return false when query throws error', async () => {
      databaseService.query.mockRejectedValueOnce(new Error('Insert failed'));
      const result = await service.createCategory({
        category_uuid: '1',
        category_name: 'Food',
      });

      expect(result).toBe(false);
    });
  });

  // ---------- updateCategory ----------
  describe('updateCategory', () => {
    it('should update and return true when category exists', async () => {
      // Mock categoryExist returning true
      jest
        .spyOn<any, any>(service, 'categoryExist')
        .mockResolvedValueOnce(true);
      databaseService.query.mockResolvedValueOnce([] as any);

      const result = await service.updateCategory({
        category_uuid: '1',
        category_name: 'Updated',
      });

      expect(result).toBe(true);
      expect(databaseService.query).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if category does not exist', async () => {
      jest
        .spyOn<any, any>(service, 'categoryExist')
        .mockResolvedValueOnce(false);

      await expect(
        service.updateCategory({
          category_uuid: '1',
          category_name: 'Updated',
        }),
      ).rejects.toThrow(
        new HttpException('The category not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return false when update query fails', async () => {
      jest
        .spyOn<any, any>(service, 'categoryExist')
        .mockResolvedValueOnce(true);
      databaseService.query.mockRejectedValueOnce(new Error('Update failed'));

      const result = await service.updateCategory({
        category_uuid: '1',
        category_name: 'Updated',
      });

      expect(result).toBe(false);
    });
  });

  // ---------- deleteCategory ----------
  describe('deleteCategory', () => {
    it('should delete and return true when category exists', async () => {
      jest
        .spyOn<any, any>(service, 'categoryExist')
        .mockResolvedValueOnce(true);
      databaseService.query.mockResolvedValueOnce([] as any);

      const result = await service.deleteCategory({ category_uuid: '1' });

      expect(result).toBe(true);
      expect(databaseService.query).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException if category does not exist', async () => {
      jest
        .spyOn<any, any>(service, 'categoryExist')
        .mockResolvedValueOnce(false);

      await expect(
        service.deleteCategory({ category_uuid: '1' }),
      ).rejects.toThrow(
        new HttpException('The category not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return false when delete query fails', async () => {
      jest
        .spyOn<any, any>(service, 'categoryExist')
        .mockResolvedValueOnce(true);
      databaseService.query.mockRejectedValueOnce(new Error('Delete failed'));

      const result = await service.deleteCategory({ category_uuid: '1' });

      expect(result).toBe(false);
    });
  });

  // ---------- categoryExist ----------
  describe('categoryExist', () => {
    it('should return true if category exists', async () => {
      databaseService.query.mockResolvedValueOnce([
        { category_uuid: '1' },
      ] as any);
      const result = await (service as any).categoryExist('1');
      expect(result).toBe(true);
    });

    it('should return false if category does not exist', async () => {
      databaseService.query.mockResolvedValueOnce([]);
      const result = await (service as any).categoryExist('1');
      expect(result).toBe(false);
    });
  });

  // ---------- itemExist ----------
  describe('itemExist', () => {
    it('should return true if item exists', async () => {
      databaseService.query.mockResolvedValueOnce([{ item_uuid: '1' }] as any);
      const result = await (service as any).itemExist('1');
      expect(result).toBe(true);
    });

    it('should return false if item does not exist', async () => {
      databaseService.query.mockResolvedValueOnce([]);
      const result = await (service as any).itemExist('1');
      expect(result).toBe(false);
    });
  });
});
