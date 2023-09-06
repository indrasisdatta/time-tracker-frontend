export interface SubCategory {
  _id: string;
  name: string;
  description?: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
}

export interface SubCategoryFormValues {
  _id?: string;
  name: string;
  description?: string;
}

export type CategoryAddFormValues = {
  _id?: string;
  name: string;
  description: string;
  subCategories: SubCategoryFormValues[];
  // subCategories: [{ _id?: string; name: string; description?: string }];
};
