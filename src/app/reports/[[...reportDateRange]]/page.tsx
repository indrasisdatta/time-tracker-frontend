"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Report } from "../Report";

const queryClient = new QueryClient();

const ReportPage = ({ params: { reportDateRange } }: { params: any }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Report reportDateRange={reportDateRange} />
    </QueryClientProvider>
  );
};

export default ReportPage;
