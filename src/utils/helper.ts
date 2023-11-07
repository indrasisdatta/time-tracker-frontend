import { Category, SubCategory } from "@/models/Category";
import { ReportSearchFormValues } from "@/models/Report";
import {
  ReactSelectType,
  TimesheetPayload,
  Timeslot,
} from "@/models/Timesheet";
import moment from "moment";

export const hourStatus = (hrs: number) => {
  const hrObj = {
    style: {
      backgroundColor: "var(--color-red)",
    },
    className: "bg-red-600",
  };
  if (hrs >= 8) {
    hrObj.className = "bg-green-600";
    hrObj.style = {
      backgroundColor: "var(--color-green)",
    };
  } else if (hrs >= 6) {
    hrObj.className = "bg-amber-600";
    hrObj.style = {
      backgroundColor: "var(--color-amber)",
    };
  }
  return hrObj;
};

export const calculateTimeDifference = (
  startTime: string,
  endTime: string,
  shorthand = false
) => {
  console.log("Check start end time", startTime, endTime);
  if (!startTime || !endTime) {
    return null;
  }
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Calculate the time difference in minutes
  let timeDiffMinutes =
    (endHours - startHours) * 60 + (endMinutes - startMinutes);

  if (timeDiffMinutes < 0) {
    return null;
  }
  return convertToHrMin(timeDiffMinutes, shorthand);
};

export const convertToHrMin = (
  timeDiffMinutes: number,
  shorthand: boolean = false
) => {
  // Calculate hours and minutes
  const hours = Math.floor(timeDiffMinutes / 60);
  const minutes = timeDiffMinutes % 60;

  // Format the output
  let result = "";
  if (hours > 0) {
    result += `${hours}` + (shorthand ? `h` : ` hr${hours !== 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    result +=
      ` ${minutes}` + (shorthand ? `m` : ` min${minutes !== 1 ? "s" : ""}`);
  }

  return result.trim();
};

/**
 * Calculate summary to show total time for each subcategory
 * @param {*} formValues - As per Timesheet form
 * @returns object
 */
export const summaryTime = (formValues: TimesheetPayload) => {
  let summary: any = { totalProductive: 0, details: {} };
  console.log("Summary time: ", formValues);
  formValues.timeslots.map((form: Timeslot) => {
    /* Required data for summary time calculation */
    if (
      !form.startTime ||
      !form.endTime ||
      !form.category ||
      !form.subCategory
    ) {
      return;
    }
    let currDate = formValues.timesheetDate;
    const startTime: any = new Date(`${currDate} ${form.startTime}`);
    const endTime: any = new Date(`${currDate} ${form.endTime}`);
    const diff = (endTime - startTime) / (60 * 1000);
    const cat = form.category as { label: any; value: any };
    /* Create category index if not present */
    if (!summary.details.hasOwnProperty(cat.label)) {
      summary.details[cat.label] = {};
    }
    /* Create subcategory index if not present */
    if (
      !summary.details[cat.label].hasOwnProperty(
        (form.subCategory as ReactSelectType).label
      )
    ) {
      summary.details[cat.label][
        (form.subCategory as ReactSelectType).label
      ] = 0;
    }
    summary.details[cat.label][(form.subCategory as ReactSelectType).label] +=
      diff;

    if ((form.subCategory as SubCategory).isProductive) {
      summary.totalProductive += diff;
    }
  });
  // categoryList
  return summary;
};

export const getStartEndDateOfMonth = (date: Date) => {
  return {
    startDate: moment(date).startOf("month").format("YYYY-MM-DD"),
    endDate: moment(date).endOf("month").format("YYYY-MM-DD"),
  };
};

export const getMonthName = (calDate: {
  startDate: string;
  endDate: string;
}) => {
  return moment(calDate.startDate).format("MMMM YYYY");
};

/* Check if it's rendered from server */
export const isServer = () => {
  return typeof window === "undefined";
};

/* Subcategory name based on id */
export const getSubcatName = (
  categoryData: Category,
  subCategoryId: string
) => {
  const subCategory = categoryData.subCategories.find(
    (subCat: any) => subCat._id === subCategoryId
  );
  return subCategory ? subCategory?.name : "";
};

/**
 *
 * @param reportDateRange - URL date range param
 * @param reportSearchPayload - payload used to display report grid, chart
 * @returns tempPayload - Updated payload with correct date
 */
export const reportDateRangeDisplay = (
  reportDateRange: string[],
  reportSearchPayload: ReportSearchFormValues
) => {
  let tempPayload = JSON.parse(JSON.stringify(reportSearchPayload));
  if (reportDateRange && typeof reportDateRange[0] !== "undefined") {
    const [startDt, endDt] = reportDateRange[0].split("_");
    if (moment(startDt).isSameOrBefore(moment(endDt))) {
      tempPayload = {
        ...tempPayload,
        dateRange: {
          startDate: startDt,
          endDate: endDt,
        },
      };
    }
  } else {
    tempPayload = {
      ...tempPayload,
      dateRange: getStartEndDateOfMonth(new Date()),
    };
  }
  return tempPayload;
};

export const emailValidateRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
