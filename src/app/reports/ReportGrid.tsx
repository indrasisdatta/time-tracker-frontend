import Link from "next/link";
import React from "react";
import { ReportSearch } from "./ReportSearch";

export const ReportGrid = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>
      <div className="mt-3">
        <ReportSearch />
      </div>
    </div>
  );
};
