import { Category, SubCategory } from "./Category";

export type ReportSearchFormValues = {
  category: string | Category;
  subCategory: string | SubCategory;
  dateRange: { startDate: string | null; endDate: string | null };
};

export type ReportSearchPayload = {
  category: string;
  subCategory: string;
  startDate: string;
  endDate: string;
};
