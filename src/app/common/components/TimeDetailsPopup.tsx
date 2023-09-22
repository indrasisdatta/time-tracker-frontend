import { Category } from "@/models/Category";
import React, { useCallback, useEffect, useState } from "react";
import { SecondaryButton } from "./buttons/Secondarybutton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { ModalCloseButton } from "./buttons/ModalCloseButton";
import { QueryKey, useQuery } from "react-query";
import { calendarSummary } from "@/services/TimesheetService";
import { convertToHrMin } from "@/utils/helper";

export const TimeDetailsPopup = ({
  title,
  message,
  selectedDate,
  showModal,
  onCloseModal,
}: {
  title: string;
  message: string | null;
  selectedDate: string;
  showModal: boolean;
  onCloseModal: any;
}) => {
  const fetchCalendarSummary = async ({
    queryKey,
  }: {
    queryKey: QueryKey;
  }): Promise<any> => {
    console.log("Query key", queryKey);
    if (queryKey[1]) {
      const { data } = await calendarSummary({
        startDate: queryKey[1] as string,
        endDate: queryKey[1] as string,
      });
      return data;
    }
  };

  const {
    isLoading,
    isError,
    data: summaryData,
    error,
  } = useQuery(["timesheetSummary", selectedDate], fetchCalendarSummary, {
    enabled: !!selectedDate,
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  useEffect(() => {
    if (selectedDate) {
      console.log("Popup Selected date: ", selectedDate);
    }
  }, [selectedDate]);

  console.log("Calendar summary data", summaryData);

  /* Summary HTML */
  const showSummaryHtml = () => {
    console.log("Summary html data", summaryData?.data);
    return (
      <div className="text-slate-500 dark:text-white leading-relaxed">
        <ul>
          {summaryData?.data?.map((calData) => (
            <li key={calData._id}>
              {calData.categoryData} - {calData.subCategory} :{" "}
              {convertToHrMin(calData.totalTime)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-96">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-700 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between pt-3 pb-1 px-3 border-b border-solid border-slate-200 rounded-t">
                  <h4 className="text-xl font-semibold">{title}</h4>
                  <ModalCloseButton clickHandler={onCloseModal} />
                </div>
                {/*body*/}
                {message && (
                  <div className="relative p-3 flex-auto">
                    {summaryData?.data &&
                      summaryData?.data?.length > 0 &&
                      showSummaryHtml()}
                    {!summaryData?.data ||
                      (summaryData?.data?.length === 0 && (
                        <p className="text-slate-500 dark:text-white leading-relaxed">
                          No records found
                        </p>
                      ))}
                  </div>
                )}
                {/*footer*/}
                <div className="flex items-center justify-end py-3 px-1 border-t border-solid border-slate-200 rounded-b">
                  <SecondaryButton
                    type="button"
                    text="Cancel"
                    onClick={onCloseModal}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};
