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
  getStartEndDateOfMonth,
  hourStatus,
} from "@/utils/helper";
import "./calendar.scss";
import { calendarMonthlyTime } from "@/services/TimesheetService";
import { QueryKey, useQuery } from "react-query";
import { useEffect, useMemo, useState } from "react";
import { redirect } from "next/navigation";

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
    className: `!text-center !m-auto md:!w-2/5`,
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

  const fetchCalendarData = async ({
    queryKey,
  }: {
    queryKey: QueryKey;
  }): Promise<any> => {
    console.log("Query key", queryKey);
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

  const {
    isLoading,
    isError,
    error,
    data: calendarData,
    refetch: refetchCalendarData,
  } = useQuery(["calendarData", calDate], fetchCalendarData);

  console.log("Calendar data: ", calendarData);
  console.log("Current cal date", calDate);
  console.log("Calendar events", calEvents);

  /* Every time month is updated, refetch calendar data */
  useEffect(() => {
    if (calDate) {
      refetchCalendarData();
    }
  }, [calDate]);

  useEffect(() => {
    if (tsDate) {
      redirect(`/calendar/timesheet/${tsDate}`);
    }
  }, [tsDate]);

  useEffect(() => {
    let tempCalEvents = JSON.parse(JSON.stringify(calEvents));
    const currentStartDate = moment(calDate.startDate).format("YYYY-MM-DD");
    tempCalEvents = tempCalEvents.filter(
      (calEvent: any) => calEvent.start !== currentStartDate
    );
    if (
      calendarData &&
      calendarData.status === 1 &&
      calendarData.data?.length > 0
    ) {
      calendarData.data.map((cal: any) => {
        (tempCalEvents as any).push({
          start: moment(cal.timesheetDate),
          end: moment(cal.timesheetDate),
          value: cal.totalTimeMins,
          title: convertToHrMin(cal.totalTimeMins, true),
        });
      });
    }
    setCalEvents(tempCalEvents);
  }, [calendarData]);

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

  return (
    <div>
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
      />
    </div>
  );
};
