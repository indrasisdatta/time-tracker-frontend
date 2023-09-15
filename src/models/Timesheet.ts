export type ReactSelectType = {
  value: string;
  label: string;
};

export interface Timeslot {
  startTime: string;
  endTime: string;
  category: string | ReactSelectType;
  subCategory: string | ReactSelectType;
  comments?: string;
}
export type TimesheetPayload = {
  timesheetDate: string;
  timeslots: Timeslot[];
};
