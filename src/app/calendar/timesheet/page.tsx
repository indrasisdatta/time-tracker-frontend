"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { TimesheetForm } from "./TimesheetForm";
import "react-datepicker/dist/react-datepicker.css";

const TimesheetEntry = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto mb-4">
        <h1 className="text-xl font-bold flex">
          <span>Timesheet Entry</span>
        </h1>
      </div>
      <TimesheetForm />
    </QueryClientProvider>
  );
};

export default TimesheetEntry;
