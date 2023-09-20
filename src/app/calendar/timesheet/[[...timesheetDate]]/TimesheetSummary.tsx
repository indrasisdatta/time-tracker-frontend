import { convertToHrMin, summaryTime } from "@/utils/helper";
import React, { memo } from "react";
import { TimesheetPayload } from "@/models/Timesheet";

const TimesheetSummary = ({
  formValues,
  categoryList,
}: {
  formValues: TimesheetPayload;
  categoryList: any;
}) => {
  const summaryData: any = summaryTime(formValues);

  console.log("Timesheet summary", summaryData);

  if (!summaryData || Object.keys(summaryData).length === 0) {
    return null;
  }

  const summaryHtml = () => {
    let html = [];
    for (let cat in summaryData.details) {
      let subCatTime = [];
      for (let subCat in summaryData.details[cat]) {
        subCatTime.push(
          <li key={subCat}>
            {subCat}: {convertToHrMin(summaryData.details[cat][subCat])}
          </li>
        );
      }
      html.push(
        <li key={cat}>
          {cat} <ul className="list-disc ml-4">{subCatTime}</ul>
        </li>
      );
    }
    return html;
  };

  return (
    <>
      <h4 className="text-lg mb-2">Summary</h4>
      <ul className="list-disc">{summaryHtml()}</ul>
      {summaryData.totalProductive && (
        <div
          className="flex items-center mt-3 md:mt-7 p-2 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div className="ml-3 text-sm font-medium">
            <span className="font-medium">Productive time: </span> <br />
            {convertToHrMin(summaryData.totalProductive)}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(TimesheetSummary);
