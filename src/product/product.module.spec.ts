import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from './product.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseService } from 'src/services/database.service';

describe('ProductModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(DatabaseService)
      .useValue({
        query: jest.fn(), // mock any methods your services use
      })
      .compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have ProductService defined', () => {
    const service = module.get<ProductService>(ProductService);
    expect(service).toBeDefined();
  });

  it('should have ProductController defined', () => {
    const controller = module.get<ProductController>(ProductController);
    expect(controller).toBeDefined();
  });
});
