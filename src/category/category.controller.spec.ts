import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CategoryDTO } from './dto/category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const mockCategoryService = {
      getCategories: jest.fn(),
      createCategory: jest.fn(),
      updateCategory: jest.fn(),
      deleteCategory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return categories successfully', async () => {
      const mockCategories = [{ name: 'Electronics' }];
      (service.getCategories as jest.Mock).mockResolvedValue(mockCategories);

      await controller.getAllCategories(mockResponse as Response);

      expect(service.getCategories).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategories);
    });
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const payload: CategoryDTO = { category_uuid: '123', category_name: 'Tech' };
      (service.createCategory as jest.Mock).mockResolvedValue(true);

      await controller.createCategory(payload, mockResponse as Response);

      expect(service.createCategory).toHaveBeenCalledWith(payload);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'The new category created successfully.',
      });
    });

    it('should throw an exception if creation fails', async () => {
      const payload: CategoryDTO = { category_uuid: '123', category_name: 'Tech' };
      (service.createCategory as jest.Mock).mockResolvedValue(false);

      await expect(
        controller.createCategory(payload, mockResponse as Response),
      ).rejects.toThrow(
        new HttpException(
          'The new category could not be added',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const payload: CategoryDTO = { category_uuid: '456', category_name: 'Home' };
      (service.updateCategory as jest.Mock).mockResolvedValue(true);

      await controller.updateCategory(payload, mockResponse as Response);

      expect(service.updateCategory).toHaveBeenCalledWith(payload);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'The new category updated successfully.',
      });
    });

    it('should throw an exception if update fails', async () => {
      const payload: CategoryDTO = { category_uuid: '456', category_name: 'Home' };
      (service.updateCategory as jest.Mock).mockResolvedValue(false);

      await expect(
        controller.updateCategory(payload, mockResponse as Response),
      ).rejects.toThrow(
        new HttpException(
          'The new category could not be updated',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      const queries = { category_uuid: '789' };
      (service.deleteCategory as jest.Mock).mockResolvedValue(true);

      await controller.deleteCategory(queries, mockResponse as Response);

      expect(service.deleteCategory).toHaveBeenCalledWith(queries);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'The new category deleted successfully.',
      });
    });

    it('should throw an exception if delete fails', async () => {
      const queries = { category_uuid: '789' };
      (service.deleteCategory as jest.Mock).mockResolvedValue(false);

      await expect(
        controller.deleteCategory(queries, mockResponse as Response),
      ).rejects.toThrow(
        new HttpException(
          'The new category could not be deleted',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
