import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CategoryDTO } from 'src/category/dto/category.dto';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/category (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/category');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/category (POST)', async () => {
    const payload: CategoryDTO = {
      category_uuid: 'uuid-123',
      category_name: 'Test',
    };
    const response = await request(app.getHttpServer())
      .post('/category')
      .send(payload);
    expect(response.status).toBe(201);
    expect(response.body.message).toContain('created successfully');
  });

  it('/category (PUT)', async () => {
    const payload: CategoryDTO = {
      category_uuid: 'uuid-123',
      category_name: 'Updated',
    };
    const response = await request(app.getHttpServer())
      .put('/category')
      .send(payload);
    expect(response.status).toBe(201);
    expect(response.body.message).toContain('updated successfully');
  });

  it('/category (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/category')
      .query({ category_uuid: 'uuid-123' });
    expect(response.status).toBe(201);
    expect(response.body.message).toContain('deleted successfully');
  });
});
