"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { TimesheetForm } from "./TimesheetForm";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TimesheetEntry = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto mb-4">
        <h1 className="text-xl font-bold flex">
          <Link href="" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-8 w-5 stroke-4" />
          </Link>
          <span className="ml-3">Timesheet Entry</span>
        </h1>
      </div>
      <TimesheetForm />
    </QueryClientProvider>
  );
};

export default TimesheetEntry;
