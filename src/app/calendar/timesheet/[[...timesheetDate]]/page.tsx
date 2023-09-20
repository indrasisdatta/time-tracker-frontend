"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { TimesheetForm } from "./TimesheetForm";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import moment from "moment";

const TimesheetEntry = ({ params: { timesheetDate } }: { params: any }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto mb-4">
        <h1 className="text-xl font-bold flex">
          <Link href="/calendar">
            <ArrowLeftIcon className="h-8 w-5 stroke-4" />
          </Link>
          <span className="ml-3">Timesheet Entry</span>
        </h1>
      </div>
      <TimesheetForm
        timesheetDateProp={
          timesheetDate && timesheetDate.length
            ? timesheetDate[0]
            : moment().format("YYYY-MM-DD")
        }
      />
    </QueryClientProvider>
  );
};

export default TimesheetEntry;
