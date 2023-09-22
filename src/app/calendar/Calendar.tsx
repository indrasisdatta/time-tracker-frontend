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
import { useCallback, useEffect, useMemo, useState } from "react";
import { redirect } from "next/navigation";
import { TimeDetailsPopup } from "../common/components/TimeDetailsPopup";

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

  /* Calendar details modal */
  const [showModal, setShowModal] = useState(false);

  /* Calendar details date selected */
  const [calSelectedDate, setCalSelectedDate] = useState("");

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
    data: calendarApiData,
    refetch: refetchCalendarData,
  } = useQuery(["calendarApiData", calDate], fetchCalendarData, {
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  console.log("Calendar data: ", calendarApiData);
  console.log("Current cal date", calDate);
  console.log("Calendar events", calEvents);

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

  return (
    <div>
      <TimeDetailsPopup
        title={`Summary: ${moment(calSelectedDate).format("DD MMM YYYY")}`}
        message={`Calendar details`}
        showModal={showModal}
        onCloseModal={closeClickHandler}
        selectedDate={calSelectedDate}
      />
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
  );
};
