import { ReportPayload } from "@/models/Report";
import { axios } from "./axios";

/* Show report search data */
export const reportData = async (data: ReportPayload) => {
  return await axios.post("timesheet/report", data);
};
