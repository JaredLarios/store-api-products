import { Test, TestingModule } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseService } from 'src/services/database.service';

// ✅ 1. Create a MockDatabaseService
class MockDatabaseService {
  query = jest.fn();
  onModuleInit = jest.fn();
  onModuleDestroy = jest.fn();
}

// ✅ 2. Create a fake module that provides the mock service
@Module({
  providers: [{ provide: DatabaseService, useClass: MockDatabaseService }],
  exports: [DatabaseService],
})
class MockDatabaseModule {}

describe('CategoryModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [MockDatabaseModule],
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();
  });

  it('should compile the module successfully', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should have CategoryController defined', () => {
    const controller = moduleRef.get<CategoryController>(CategoryController);
    expect(controller).toBeInstanceOf(CategoryController);
  });

  it('should have CategoryService defined', () => {
    const service = moduleRef.get<CategoryService>(CategoryService);
    expect(service).toBeInstanceOf(CategoryService);
  });

  it('should inject the mock DatabaseService properly', () => {
    const dbService = moduleRef.get<DatabaseService>(DatabaseService);
    expect(dbService).toBeInstanceOf(MockDatabaseService);
  });
});
