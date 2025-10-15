import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.URI as string;
    if (!connectionString) {
      throw new Error(
        'Database connection URI is not defined in the environment variables.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.pool = new Pool({ connectionString });
  }

  async onModuleInit() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.pool.connect();
      console.log('DataBase Connected');
    } catch (error) {
      console.log('Database connection Error');
      throw error;
    }
  }

  async onModuleDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.pool.release();
    console.log('Database Connection Closed');
  }

  async query<T>(queryText: string, params?: any[]): Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const result: T = (await this.pool.query(queryText, params))?.rows;
      return result;
    } catch (error) {
      console.log('Database query error: ', error);
      throw error;
    }
  }
}
