interface PaginationI {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

interface ProductsI {
  item_uuid: string;
  item_name: string;
  item_price: number;
  item_price_off?: number;
  item_image_url?: string;
  item_price_off_until_date?: Date;
  item_created_at: Date;
  item_updated_at: Date;
  item_quantity: number;
  category_uuid?: string;
  category: string;
  page: number;
  quantity: number;
}

/* Get Product */
export type ProductsQueries = Pick<
  ProductsI,
  'category_uuid' | 'page' | 'quantity'
>;

export type SingleProductQueries = Pick<ProductI, 'item_uuid'>;

export type ProductI = Omit<ProductsI, 'page' | 'quantity' | 'category_uuid'>;

export type TotalItems = Pick<PaginationI, 'total_items'>;

export type ResponseI<T> = {
  data: T;
  meta: PaginationI;
};

/* Create Product */
export type NewProduct = Omit<
  ProductsI,
  'page' | 'quantity' | 'category' | 'item_created_at' | 'item_updated_at'
>;

/* Update Product */
export type UpdateProduct = Pick<ProductsI, 'item_uuid'> &
  Partial<
    Omit<
      ProductsI,
      | 'page'
      | 'quantity'
      | 'category'
      | 'item_created_at'
      | 'item_uuid'
      | 'updated_at'
    >
  >;

/* Delete Product */
export type DeleteProduct = Pick<ProductsI, 'item_uuid'>;
