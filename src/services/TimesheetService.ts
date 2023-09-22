import { CalendarPayload, TimesheetPayload } from "@/models/Timesheet";
import { axios } from "./axios";

/* Add/edit timesheet entry for a date */
export const saveTimesheet = async (data: TimesheetPayload) => {
  return await axios.post("timesheet/save", data);
};

/* To populate previously saved timesheet entries for a date */
export const getTimesheetDatewise = async (tsDate: string) => {
  return await axios.get(`timesheet/${tsDate}`);
};

/* To show dates in calendar for entire month */
export const calendarMonthlyTime = async (data: CalendarPayload) => {
  return await axios.post("timesheet/calendar", data);
};

/* Show popup summary for a date */
export const calendarSummary = async (data: CalendarPayload) => {
  return await axios.post("timesheet/summary", data);
};
