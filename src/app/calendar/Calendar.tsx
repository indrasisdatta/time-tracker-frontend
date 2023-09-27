"use client";
import moment from "moment";
import {
  Calendar,
  Event,
  EventPropGetter,
  NavigateAction,
  View,
  momentLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  convertToHrMin,
  getMonthName,
  getStartEndDateOfMonth,
  hourStatus,
} from "@/utils/helper";
import "./calendar.scss";
import {
  calendarMonthlyTime,
  weeklytimeList,
} from "@/services/TimesheetService";
import { QueryKey, useQuery } from "react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { redirect } from "next/navigation";
import { TimeDetailsPopup } from "../common/components/TimeDetailsPopup";
import { Loader } from "../common/components/Loader";

interface CustomEvent extends Event {
  value: string | number;
}

const localizer = momentLocalizer(moment);

// const CustomToolbar = (onNavigate) => {
//   <div>
//     <button onClick={() => onNavigate("PREV")}>Prev</button>
//     <button onClick={() => onNavigate("NEXT")}>Next</button>
//   </div>;
// };

const eventPropGetter: EventPropGetter<CustomEvent> = (event) => {
  const hrs = Number(event.value) / 60;
  const { style } = hourStatus(hrs);
  return {
    className: `!text-center !m-auto md:!w-3/5`,
    style,
  };
};

export const CalendarChild = () => {
  /* Stores start and end date of selected month */
  const [calDate, setCalDate] = useState(getStartEndDateOfMonth(new Date()));

  /* Cal events i.e productive time spent each day */
  const [calEvents, setCalEvents] = useState([]);

  /* Selected date - open timesheet for this date */
  const [tsDate, setTsDate] = useState("");

  /* Calendar details modal */
  const [showModal, setShowModal] = useState(false);

  /* Calendar details date selected */
  const [calSelectedDate, setCalSelectedDate] = useState("");

  const fetchCalendarData = async ({
    queryKey,
  }: {
    queryKey: QueryKey;
  }): Promise<any> => {
    console.log("Calendar API Query key", queryKey);
    if (
      queryKey[1] &&
      queryKey[1].hasOwnProperty("startDate") &&
      (queryKey[1] as any)?.startDate &&
      queryKey[1].hasOwnProperty("endDate") &&
      (queryKey[1] as any)?.endDate
    ) {
      const { data } = await calendarMonthlyTime({
        startDate: (queryKey[1] as any)?.startDate,
        endDate: (queryKey[1] as any)?.endDate,
      });
      return data;
    }
  };

  const fetchWeeklyTimes = async ({
    queryKey,
  }: {
    queryKey: QueryKey;
  }): Promise<any> => {
    console.log("Weekly API Query key", queryKey);
    if (queryKey[1] && queryKey[1].hasOwnProperty("startDate")) {
      let dateStr = (queryKey[1] as any).startDate;
      dateStr = dateStr.split("-", 2).join("-");
      const { data } = await weeklytimeList(dateStr);
      return data;
    }
  };

  const {
    isLoading: isLoadingCal,
    isError: isErrorCal,
    error: errorCal,
    data: calendarApiData,
    // refetch: refetchCalendarData,
  } = useQuery(["calendarApiData", calDate], fetchCalendarData, {
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const {
    isLoading: isLoadingWeek,
    isError: isErrorWeek,
    error: errorWeek,
    data: weeklyApiData,
  } = useQuery(["weeklyApi", calDate], fetchWeeklyTimes, {
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  console.log("Calendar data: ", calendarApiData);
  console.log("Current cal date", calDate);
  console.log("Calendar events", calEvents);
  console.log("Weekly data:", weeklyApiData);

  /* Every time month is updated, refetch calendar data */
  useEffect(() => {
    let hasExisting = null;
    if (calDate) {
      let tempCalEvents = JSON.parse(JSON.stringify(calEvents));
      if (tempCalEvents && tempCalEvents.length > 0) {
        const currentStartDate = moment(calDate.startDate).format("YYYY-MM-DD");
        hasExisting = tempCalEvents.some(
          (calEvent: any) =>
            moment(calEvent.start).format("YYYY-MM-DD") === currentStartDate
        );
        console.log("tempCalEvents", tempCalEvents);
        console.log("currentStartDate", currentStartDate);
        console.log("hasExisting", hasExisting);
        /* Already fetched data for this month earlier, no need to make API call */
        if (hasExisting) {
          return;
        }
      }
      // refetchCalendarData();
    }
  }, [calDate]);

  /* When calendar date is clicked, open timesheet for this date */
  useEffect(() => {
    if (tsDate) {
      redirect(`/calendar/timesheet/${tsDate}`);
    }
  }, [tsDate]);

  /* When calendar API data is fetched, update calendar events for that month */
  useEffect(() => {
    const tempCalEvents: any = [];
    if (
      calendarApiData &&
      calendarApiData.status === 1 &&
      calendarApiData.data?.length > 0
    ) {
      calendarApiData.data.map((cal: any) => {
        (tempCalEvents as any).push({
          start: moment(cal.timesheetDate),
          end: moment(cal.timesheetDate),
          value: cal.totalTimeMins,
          title: convertToHrMin(cal.totalTimeMins, true),
        });
      });
    }
    setCalEvents(tempCalEvents);
  }, [calendarApiData]);

  /* Date select + Prev, next, current button actions */
  const onNavigate = (newDate: Date, view: View, action: NavigateAction) => {
    console.log("Calendar navigate", newDate, view, action);
    switch (action) {
      case "DATE":
        console.log("Redirect");
        setTsDate(moment(newDate).format("YYYY-MM-DD"));
      case "TODAY":
      case "PREV":
      case "NEXT":
        setCalDate(getStartEndDateOfMonth(newDate));
    }
  };

  /* Calendar date selected - show popup with details */
  const onSelectEvent = (event: CustomEvent) => {
    const selectedDate = moment(event.start).format("YYYY-MM-DD");
    console.log("Selected date", selectedDate);
    setCalSelectedDate(selectedDate);
    setShowModal(true);
  };

  /* Close button click handler */
  const closeClickHandler = useCallback(() => {
    setShowModal(false);
  }, [showModal]);

  const weeklyHtml = () => {
    if (isLoadingWeek) {
      return <Loader className="m-auto my-8 flex" />;
    }
    if (isErrorWeek) {
      return (
        <div className="mt-3">
          {(errorWeek as Error)?.message
            ? (errorWeek as Error).message
            : "Something went wrong. Please try again later."}
        </div>
      );
    }
    if (
      weeklyApiData &&
      (!weeklyApiData.data || weeklyApiData.data?.length === 0)
    ) {
      return <div className="mt-3">No records found</div>;
    }
    if (weeklyApiData && weeklyApiData.data && weeklyApiData.data?.length > 0) {
      return (
        <ul className="mt-3">
          {weeklyApiData.data?.map((weekData: any) => (
            <li key={weekData._id}>
              {moment(weekData.week?.start).format("DD MMM")} -{" "}
              {moment(weekData.week?.end).format("D MMM")}:{" "}
              {convertToHrMin(
                Math.round(weekData.totalProductiveMins / weekData.workingDays),
                true
              )}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="md:flex">
      <TimeDetailsPopup
        title={`Summary: ${moment(calSelectedDate).format("DD MMM YYYY")}`}
        message={`Calendar details`}
        showModal={showModal}
        onCloseModal={closeClickHandler}
        selectedDate={calSelectedDate}
      />
      <div className="w-full md:w-9/12">
        {isLoadingCal && (
          <div className="m-auto my-8 text-center">
            <Loader className="" />{" "}
            <p className="mb-6">Loading data for {getMonthName(calDate)}</p>
          </div>
        )}
        {isErrorCal && (
          <div className="m-auto my-3 text-center">
            <p className="mb-3">
              {(errorCal as Error)?.message
                ? (errorCal as Error).message
                : "Something went wrong. Please try again later."}
            </p>
          </div>
        )}
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          events={calEvents}
          views={["month"]}
          eventPropGetter={eventPropGetter}
          messages={{ previous: "Prev", next: "Next", today: "Current" }}
          onNavigate={onNavigate}
          onSelectEvent={onSelectEvent}
        />
      </div>
      <div className="w-full md:w-3/12 mx-4 my-1">
        <div className="max-w-sm px-4 py-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h5 className="text-xl">Weekly time spent</h5>
          {weeklyHtml()}
        </div>
      </div>
    </div>
  );
};
