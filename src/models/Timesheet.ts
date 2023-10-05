import { Category, SubCategory } from "./Category";

export type ReactSelectType = {
  value: string;
  label: string;
};

export interface Timeslot {
  startTime: string;
  endTime: string;
  category: string | ReactSelectType;
  subCategory: string | ReactSelectType | SubCategory;
  isProductive?: boolean;
  comments?: string;
}
export type TimesheetPayload = {
  timesheetDate: string;
  timeslots: Timeslot[];
};
export type CalendarPayload = {
  startDate: string;
  endDate: string;
};
