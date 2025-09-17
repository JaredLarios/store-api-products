import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import {
  NewProduct,
  ProductI,
  ProductsQueries,
  ResponseI,
  TotalItems,
  UpdateProduct,
} from './interfaces/product.interface';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createProduct(newProduct: NewProduct): Promise<boolean> {
    const query = `
        INSERT INTO store.item(
            item_uuid,
            item_name,
            item_price,
            item_price_off,
            item_image_url,
            item_price_off_until_date,
            item_quantity
        )
        VALUES ( $1, $2, $3, $4, $5, $6, $7);
    `;

    await this.databaseService
      .query<
        any[]
      >(query, [newProduct.item_uuid, newProduct.item_name, newProduct.item_price, newProduct.item_price_off || null, newProduct.item_image_url || null, newProduct.item_price_off_until_date || null, newProduct.item_quantity])
      .catch((error) => {
        console.log(error);
        return false;
      });

    return true;
  }

  async updateProduct(product: UpdateProduct): Promise<boolean> {
    const exist_uuid = await this.itemExist(product.item_uuid);

    if (!exist_uuid) {
      throw new HttpException('The item does not exist', HttpStatus.NOT_FOUND);
    }

    const query = `
        UPDATE store.item
        SET
            item_name = COALESCE($1, item_name),
            item_price = COALESCE($2, item_price),
            item_price_off = COALESCE($3, item_price_off),
            item_image_url = COALESCE($4, item_image_url),
            item_price_off_until_date = COALESCE($5, item_price_off_until_date),
            item_updated_at = COALESCE($6, item_updated_at),
            item_quantity = COALESCE($7, item_quantity)
        WHERE item_uuid = $8;
    `;

    await this.databaseService
      .query<
        any[]
      >(query, [product.item_name ?? null, product.item_price ?? null, product.item_price_off ?? null, product.item_image_url ?? null, product.item_price_off_until_date ?? null, new Date(), product.item_quantity ?? null, product.item_uuid])
      .catch((error) => {
        console.log(error);
        throw new HttpException(
          error as string,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return true;
  }

  async findProducts(
    queries: Partial<ProductsQueries>,
  ): Promise<ResponseI<ProductI>> {
    let data: ProductI;

    if (queries.quantity && queries.quantity < 0) queries.quantity = 1;
    if (!queries.quantity || queries.quantity > 10) queries.quantity = 10;

    if (!queries.page || queries.page < 0) queries.page = 1;
    if (queries.page && queries.page > 1000) queries.page = 10;

    const pagination_query = `
        SELECT COUNT(*) as total_items
        FROM store.item
    `;

    const totalItemsResponse = await this.databaseService.query<TotalItems[]>(
      pagination_query,
      [],
    );

    const totalItemsDB = totalItemsResponse[0];
    const total_items = +totalItemsDB.total_items;
    let total_pages = Math.ceil(total_items / +queries.quantity || 1);

    if (total_items === 0) total_pages = 0;

    const meta = {
      page: +queries.page || 1,
      total_items,
      page_size: +queries.quantity || 1,
      total_pages,
    };

    const offset = ((queries.page ?? 1) - 1) * (queries.quantity || 1);

    if (queries.category_uuid) {
      const query = `
            SELECT 	i.item_id,
                item_uuid,
                item_name,
                item_price,
                item_price_off,
                item_image_url,
                item_price_off_until_date,
                item_created_at,
                item_updated_at,
                item_quantity,
                c.category_name
            FROM store.item i
            LEFT JOIN store.item_has_category ic ON ic.item_id = i.item_id
            LEFT JOIN store.category c ON c.category_id = ic.category_id
            WHERE c.category_uuid = $1
            LIMIT $2 OFFSET $3;
        `;

      data = await this.databaseService.query<ProductI>(query, [
        queries.category_uuid,
        queries.quantity || 1,
        offset,
      ]);
    } else {
      const query = `
            SELECT  item_uuid,
                    item_name,
                    item_price,
                    item_price_off,
                    item_image_url,
                    item_price_off_until_date,
                    item_created_at,
                    item_updated_at,
                    item_quantity
            FROM store.item
            LIMIT $1 OFFSET $2;
        `;

      data = await this.databaseService.query<ProductI>(query, [
        queries.quantity || 1,
        offset,
      ]);
    }

    return { data, meta };
  }

  async deleteProduct(itemUuid: string): Promise<boolean> {
    const exist_uuid = await this.itemExist(itemUuid);

    if (!exist_uuid) {
      throw new HttpException('The item does not exist', HttpStatus.NOT_FOUND);
    }

    const query = `
        DELETE FROM store.item
	    WHERE item_uuid = $1;
    `;

    await this.databaseService.query(query, [itemUuid]).catch((error) => {
      console.log(error);
      return false;
    });

    return true;
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
