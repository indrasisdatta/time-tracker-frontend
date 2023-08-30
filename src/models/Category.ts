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
