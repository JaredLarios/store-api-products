import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import {
  CategoryWithoutId,
  DeleteCategory,
  NewCategory,
  UpdateCategory,
} from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCategories(): Promise<CategoryWithoutId[]> {
    const query = `
          SELECT category_uuid, category_name
	        FROM store.category;
      `;

    const response =
      await this.databaseService.query<CategoryWithoutId[]>(query);

    if (!response) {
      throw new HttpException(
        'Database is not giving a response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response;
  }

  async createCategory(newCategory: NewCategory): Promise<boolean> {
    const query = `
      INSERT INTO store.category(
        category_uuid, category_name)
      VALUES ($1, $2);
    `;

    try {
      await this.databaseService.query<any[]>(query, [
        newCategory.category_uuid,
        newCategory.category_name,
      ]);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  async updateCategory(category: UpdateCategory): Promise<boolean> {
    const existingCategory = await this.categoryExist(category.category_uuid);

    if (!existingCategory) {
      throw new HttpException('The category not found', HttpStatus.NOT_FOUND);
    }

    const query = `
      UPDATE store.category
      SET category_name = $1
      WHERE category_uuid = $2;
    `;

    try {
      await this.databaseService.query<any[]>(query, [
        category.category_name,
        category.category_uuid,
      ]);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  async deleteCategory(category: DeleteCategory): Promise<boolean> {
    const existingCategory = await this.categoryExist(category.category_uuid);

    if (!existingCategory) {
      throw new HttpException('The category not found', HttpStatus.NOT_FOUND);
    }

    const query = `
          DELETE FROM store.category
          WHERE category_uuid = $1;
    `;

    try {
      await this.databaseService.query<any[]>(query, [category.category_uuid]);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  private async itemExist(item_uuid: string): Promise<boolean> {
    const query = `
        SELECT item_uuid
        FROM store.item
        WHERE item_uuid = $1
    `;

    const response = await this.databaseService.query<any[]>(query, [
      item_uuid,
    ]);

    if (response.length < 1) {
      return false;
    }

    return true;
  }

  private async categoryExist(category_uuid: string): Promise<boolean> {
    const query = `
        SELECT category_uuid
        FROM store.category
        WHERE category_uuid = $1
    `;

    const response = await this.databaseService.query<any[]>(query, [
      category_uuid,
    ]);

    if (response.length < 1) {
      return false;
    }

    return true;
  }
}
