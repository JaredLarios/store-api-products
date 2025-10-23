import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { DatabaseService } from '../services/database.service';
import { HttpException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should return true if query succeeds', async () => {
      mockDatabaseService.query.mockResolvedValueOnce([]);

      const result = await service.createProduct({
        item_uuid: 'uuid1',
        item_name: 'Product1',
        item_price: 100,
        item_quantity: 10,
      });

      expect(result).toBe(true);
      expect(databaseService.query).toHaveBeenCalled();
    });

    it('should return false if query fails', async () => {
      mockDatabaseService.query.mockRejectedValueOnce(new Error('DB Error'));

      const result = await service.createProduct({
        item_uuid: 'uuid1',
        item_name: 'Product1',
        item_price: 100,
        item_quantity: 10,
      });

      expect(result).toBe(false);
    });
  });

  describe('itemExist', () => {
    it('should return true if item exists', async () => {
      mockDatabaseService.query.mockResolvedValueOnce([{ item_uuid: 'uuid1' }]);

      const result = await service.itemExist('uuid1');
      expect(result).toBe(true);
    });

    it('should return false if item does not exist', async () => {
      mockDatabaseService.query.mockResolvedValueOnce([]);
      const result = await service.itemExist('uuid1');
      expect(result).toBe(false);
    });
  });

  describe('updateProduct', () => {
    it('should update product if it exists', async () => {
      jest.spyOn(service, 'itemExist').mockResolvedValueOnce(true);
      mockDatabaseService.query.mockResolvedValueOnce([]);

      const result = await service.updateProduct({
        item_uuid: 'uuid1',
        item_name: 'Updated Name',
      });

      expect(result).toBe(true);
      expect(databaseService.query).toHaveBeenCalled();
    });

    it('should throw HttpException if item does not exist', async () => {
      jest.spyOn(service, 'itemExist').mockResolvedValueOnce(false);

      await expect(
        service.updateProduct({ item_uuid: 'uuid1' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findSingleProduct', () => {
    it('should return product if found', async () => {
      const product = { item_uuid: 'uuid1', item_name: 'Product1' };
      mockDatabaseService.query.mockResolvedValueOnce([product]);

      const result = await service.findSingleProduct({ item_uuid: 'uuid1' });
      expect(result).toEqual(product);
    });

    it('should throw HttpException if not found', async () => {
      mockDatabaseService.query.mockResolvedValueOnce([]);

      await expect(
        service.findSingleProduct({ item_uuid: 'uuid1' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product if it exists', async () => {
      jest.spyOn(service, 'itemExist').mockResolvedValueOnce(true);
      mockDatabaseService.query.mockResolvedValueOnce([]);

      const result = await service.deleteProduct('uuid1');
      expect(result).toBe(true);
    });

    it('should throw HttpException if item does not exist', async () => {
      jest.spyOn(service, 'itemExist').mockResolvedValueOnce(false);

      await expect(service.deleteProduct('uuid1')).rejects.toThrow(HttpException);
    });
  });
});
