import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  const mockProductService = {
    findProducts: jest.fn(),
    findSingleProduct: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return products with status 200', async () => {
      const res = mockResponse();
      const products = { data: [], meta: {} };
      mockProductService.findProducts.mockResolvedValue(products);

      await controller.getAllProducts({}, res);

      expect(mockProductService.findProducts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(products);
    });
  });

  describe('getSingleProduct', () => {
    it('should return a single product with status 200', async () => {
      const res = mockResponse();
      const product = { item_uuid: 'uuid1', item_name: 'Product1' };
      mockProductService.findSingleProduct.mockResolvedValue(product);

      await controller.getSingleProduct({ item_uuid: 'uuid1' }, res);

      expect(mockProductService.findSingleProduct).toHaveBeenCalledWith({
        item_uuid: 'uuid1',
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(product);
    });
  });

  describe('createProduct', () => {
    it('should create product and return 201', async () => {
      const res = mockResponse();
      mockProductService.createProduct.mockResolvedValue(true);

      await controller.createProduct({ item_name: 'Test' } as any, res);

      expect(mockProductService.createProduct).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({ message: 'product created' });
    });

    it('should throw HttpException if creation fails', async () => {
      const res = mockResponse();
      mockProductService.createProduct.mockResolvedValue(false);

      await expect(
        controller.createProduct({ item_name: 'Test' } as any, res),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateProduct', () => {
    it('should update product and return 202', async () => {
      const res = mockResponse();
      mockProductService.updateProduct.mockResolvedValue(true);

      await controller.updateProduct({ item_name: 'Updated' } as any, res);

      expect(mockProductService.updateProduct).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
      expect(res.json).toHaveBeenCalledWith({ message: 'product updated' });
    });

    it('should throw HttpException if update fails', async () => {
      const res = mockResponse();
      mockProductService.updateProduct.mockResolvedValue(false);

      await expect(
        controller.updateProduct({ item_name: 'Updated' } as any, res),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product and return 202', async () => {
      const res = mockResponse();
      mockProductService.deleteProduct.mockResolvedValue(true);

      await controller.deleteProduct({ item_uuid: 'uuid1' }, res);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith('uuid1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item successfully deleted' });
    });

    it('should throw HttpException if delete fails', async () => {
      const res = mockResponse();
      mockProductService.deleteProduct.mockResolvedValue(false);

      await expect(
        controller.deleteProduct({ item_uuid: 'uuid1' }, res),
      ).rejects.toThrow(HttpException);
    });
  });
});
