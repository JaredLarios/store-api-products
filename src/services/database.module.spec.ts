import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';
import { Pool } from 'pg';

// ✅ Fake environment variable to bypass constructor check
process.env.URI = 'postgres://user:pass@localhost:5432/testdb';

// ✅ Mock pg.Pool so it behaves like your DatabaseService expects
jest.mock('pg', () => {
  const mockClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    end: jest.fn().mockResolvedValue(undefined),
  };

  const mockPool = jest.fn(() => mockClient);
  return { Pool: mockPool };
});

describe('DatabaseModule (with mock pool)', () => {
  let databaseService: DatabaseService;
  let mockPool: jest.Mocked<any>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
    mockPool = (Pool as unknown as jest.Mock).mock.results[0].value;
  });

  it('should create the service', () => {
    expect(databaseService).toBeDefined();
  });

  it('should connect on module init', async () => {
    await databaseService.onModuleInit();
    expect(mockPool.connect).toHaveBeenCalled();
  });

  it('should end connection on destroy', async () => {
    await databaseService.onModuleDestroy();
    expect(mockPool.release).toHaveBeenCalled();
  });
});
