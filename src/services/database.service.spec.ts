import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { Pool } from 'pg';

// Mock the 'pg' Pool class
jest.mock('pg', () => {
  const mockPool = {
    connect: jest.fn(),
    release: jest.fn(),
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockPool: jest.Mocked<Pool>;

  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...OLD_ENV, URI: 'postgres://fake-connection-uri' };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    mockPool = (Pool as unknown as jest.Mock).mock.results[0].value;
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  // ---------- Constructor ----------
  it('should create service and initialize pool with environment URI', () => {
    expect(service).toBeDefined();
    expect(Pool).toHaveBeenCalledWith({
      connectionString: 'postgres://fake-connection-uri',
    });
  });

  it('should throw error if URI is missing in environment variables', () => {
    delete process.env.URI;
    expect(() => new DatabaseService()).toThrowError(
      'Database connection URI is not defined in the environment variables.',
    );
  });

  // ---------- onModuleInit ----------
  it('should call pool.connect() on module init', async () => {
    await service.onModuleInit();
    expect(mockPool.connect).toHaveBeenCalled();
  });

  it('should throw error if connect() fails', async () => {
    const error = new Error('connection failed');
    mockPool.connect.mockRejectedValueOnce(error);
    await expect(service.onModuleInit()).rejects.toThrow(error);
  });

  // ---------- onModuleDestroy ----------
  it('should call pool.release() on module destroy', async () => {
    await service.onModuleDestroy();
    expect(mockPool.release).toHaveBeenCalled();
  });

  // ---------- query ----------
  it('should execute query and return rows', async () => {
    const mockRows = [{ id: 1, name: 'Test' }];
    mockPool.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await service.query('SELECT * FROM users');
    expect(mockPool.query).toHaveBeenCalledWith(
      'SELECT * FROM users',
      undefined,
    );
    expect(result).toEqual(mockRows);
  });

  it('should execute query with params', async () => {
    const mockRows = [{ id: 1 }];
    mockPool.query.mockResolvedValueOnce({ rows: mockRows });

    const result = await service.query('SELECT * FROM users WHERE id=$1', [1]);
    expect(mockPool.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id=$1',
      [1],
    );
    expect(result).toEqual(mockRows);
  });

  it('should throw error if query fails', async () => {
    const error = new Error('query failed');
    mockPool.query.mockRejectedValueOnce(error);

    await expect(service.query('SELECT * FROM fail')).rejects.toThrow(error);
  });
});
