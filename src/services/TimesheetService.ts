import { TimesheetPayload } from "@/models/Timesheet";
import { axios } from "./axios";

export const saveTimesheet = async (data: TimesheetPayload) => {
  return await axios.post("timesheet/save", data);
};

export const getTimesheetDatewise = async (tsDate: string) => {
  return await axios.get(`timesheet/${tsDate}`);
};
