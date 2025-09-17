interface CategoryI {
  category_id: number;
  category_uuid: string;
  category_name: string;
}

/* Views Category */
export type Categories = CategoryI;
export type CategoryWithoutId = Omit<CategoryI, 'category_id'>;

/* Create Category */
export type NewCategory = Omit<CategoryI, 'category_id'>;

/* Update Category */
export type UpdateCategory = Pick<CategoryI, 'category_name' | 'category_uuid'>;

/* Delete Category */
export type DeleteCategory = Pick<CategoryI, 'category_uuid'>;
