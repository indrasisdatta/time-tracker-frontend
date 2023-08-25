"use client";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { hourStatus } from "@/utils/helper";

const localizer = momentLocalizer(moment);

const myEvents = [
  { start: new Date("2023-08-22"), end: new Date("2023-08-22"), title: "8" },
  { start: new Date("2023-08-21"), end: new Date("2023-08-21"), title: "9" },
  { start: new Date("2023-08-16"), end: new Date("2023-08-16"), title: "7" },
  { start: new Date("2023-08-14"), end: new Date("2023-08-14"), title: "4" },
  { start: new Date("2023-08-18"), end: new Date("2023-08-18"), title: "5" },
];

const CustomToolbar = ({ label, onNavigate }) => {
  <div>
    <button onClick={() => onNavigate("PREV")}>Prev</button>
    <button onClick={() => onNavigate("NEXT")}>Next</button>
  </div>;
};

const eventPropGetter = (event) => {
  console.log(event);
  const hrs = Number(event.title);
  const { className: hrCls } = hourStatus(hrs);
  return {
    className: `!${hrCls} !text-center !m-auto md:!w-1/5`,
  };
};

const CalendarPage = () => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        events={myEvents}
        views={["month"]}
        eventPropGetter={eventPropGetter}
        messages={{ previous: "Prev", next: "Next", today: "Current" }}
      />
    </div>
  );
};

export default CalendarPage;
