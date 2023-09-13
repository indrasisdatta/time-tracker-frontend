import { convertToHrMin, summaryTime } from "@/utils/helper";
import React, { memo } from "react";
import { TimesheetPayload } from "@/models/Timesheet";

const TimesheetSummary = ({ formValues }: { formValues: TimesheetPayload }) => {
  const summaryData: any = summaryTime(formValues);

  console.log("Timesheet summary", summaryData);

  if (!summaryData || Object.keys(summaryData).length === 0) {
    return null;
  }

  const summaryHtml = () => {
    let html = [];
    for (let cat in summaryData) {
      let subCatTime = [];
      for (let subCat in summaryData[cat]) {
        subCatTime.push(
          <li key={subCat}>
            {subCat}: {convertToHrMin(summaryData[cat][subCat])}
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
      {/* <h4 className="text-lg">Summary</h4> */}
      <ul className="list-disc">{summaryHtml()}</ul>
    </>
  );
};

export default memo(TimesheetSummary);
