"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Report } from "./Report";

const queryClient = new QueryClient();

const ReportPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Report />
    </QueryClientProvider>
  );
};

export default ReportPage;
