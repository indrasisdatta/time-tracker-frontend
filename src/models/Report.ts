import { Category } from "./Category";

export type ReportSearchFormValues = {
  category: string | { label: string; value: string };
  subCategory: string | { label: string; value: string };
  dateRange: { startDate: string | null; endDate: string | null };
};

export type ReportSearchPayload = {
  category: string;
  subCategory: string;
  startDate: string;
  endDate: string;
};

export type ReportGrid = {
  category?: string;
  categoryData: Category;
  subCategory: string;
  totalTime: number;
};
export type ReportPayload = {
  category: string | null;
  subCategory: string | null;
  startDate: string | null;
  endDate: string | null;
};
