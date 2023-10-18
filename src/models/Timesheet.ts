import { Category, SubCategory } from "./Category";

export type ReactSelectType = {
  value: string;
  label: string;
};

export interface Timeslot {
  id?: string;
  startTime: string;
  endTime: string;
  category: string | ReactSelectType;
  subCategory: string | ReactSelectType | SubCategory;
  isProductive?: boolean;
  comments?: string;
  isNew?: boolean;
}
export type TimesheetPayload = {
  timesheetDate: string;
  timeslots: Timeslot[];
};
export type CalendarPayload = {
  startDate: string;
  endDate: string;
};

export type ModalValues = Timeslot & {
  prevEndTime: null | string;
  index: null | number;
  formValues: TimesheetPayload;
};
