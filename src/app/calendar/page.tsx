"use client";
import moment from "moment";
import "./calendar.scss";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { CalendarChild } from "./Calendar";

const CalendarPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CalendarChild />
    </QueryClientProvider>
  );
};

export default CalendarPage;
