import moment from "moment";

export const hourStatus = (hrs) => {
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
  startTime,
  endTime,
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

export const convertToHrMin = (timeDiffMinutes, shorthand) => {
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
export const summaryTime = (formValues) => {
  let summary = { totalProductive: 0, details: {} };
  console.log("Summary time: ", formValues);
  formValues.timeslots.map((form) => {
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
    const startTime = new Date(`${currDate} ${form.startTime}`);
    const endTime = new Date(`${currDate} ${form.endTime}`);
    const diff = (endTime - startTime) / (60 * 1000);
    /* Create category index if not present */
    if (!summary.details.hasOwnProperty(form.category.label)) {
      summary.details[form.category.label] = {};
    }
    /* Create subcategory index if not present */
    if (
      !summary.details[form.category.label].hasOwnProperty(
        form.subCategory.label
      )
    ) {
      summary.details[form.category.label][form.subCategory.label] = 0;
    }
    summary.details[form.category.label][form.subCategory.label] += diff;

    if (form.subCategory.isProductive) {
      summary.totalProductive += diff;
    }
  });
  // categoryList
  return summary;
};

export const getStartEndDateOfMonth = (date) => {
  return {
    startDate: moment(date).startOf("month").format("YYYY-MM-DD"),
    endDate: moment(date).endOf("month").format("YYYY-MM-DD"),
  };
};
