export interface Timeslot {
  startTime: string;
  endTime: string;
  category: string;
  subCategory: string;
  comments?: string;
}
export type TimesheetPayload = {
  timesheetDate: string;
  timeslots: Timeslot[];
};
