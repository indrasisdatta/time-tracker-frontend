"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReportGrid } from "./ReportGrid";

const queryClient = new QueryClient();

const Report = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportGrid />
    </QueryClientProvider>
  );
};

export default Report;
