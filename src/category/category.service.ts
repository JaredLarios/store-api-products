import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { Categories, CategoryWithoutId } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCategories(): Promise<CategoryWithoutId> {
    const query = `
          SELECT category_id, category_uuid, category_name
	        FROM store.category;
      `;

    const response = await this.databaseService.query<Categories>(query);

    if (!response) {
      throw new HttpException(
        'Database is not giving a response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response;
  }

  async itemExist(item_uuid: string): Promise<boolean> {
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
}
