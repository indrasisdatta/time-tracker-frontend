import React, { useMemo, useState, useEffect } from "react";
import { ReportSearch } from "./ReportSearch";
import { Table } from "../common/components/tables/Table";
import { ReportGrid, ReportSearchFormValues } from "@/models/Report";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { ReportGraph } from "./ReportGraph";
import { getStartEndDateOfMonth } from "@/utils/helper";
import { useQuery } from "react-query";
import { reportData } from "@/services/ReportService";
import { ReactSelectType } from "@/models/Timesheet";

export const Report = () => {
  /* Search payload used to fetch data for both grid and chart */
  const [reportSearchPayload, setReportSearchPayload] =
    useState<ReportSearchFormValues>({
      category: "",
      subCategory: "",
      dateRange: getStartEndDateOfMonth(new Date()),
    });
  const [reportRows, setReportRows] = useState([]);

  const fetchReport = async () => {
    const {
      category,
      subCategory,
      dateRange: { startDate, endDate },
    } = reportSearchPayload;
    const payload = {
      category:
        category && (category as ReactSelectType).hasOwnProperty("value")
          ? (category as ReactSelectType).value
          : "",
      subCategory:
        subCategory && subCategory.hasOwnProperty("value")
          ? (subCategory as ReactSelectType).value
          : "",
      startDate,
      endDate,
    };
    const { data } = await reportData(payload);
    return data;
  };

  const {
    isLoading: isLoadingReport,
    isError: isErrorReport,
    data: reportApiData,
    error: reportError,
  } = useQuery({
    queryKey: ["report", reportSearchPayload],
    queryFn: () => fetchReport(),
  });

  const columnHelper = createColumnHelper<ReportGrid>();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row.categoryData.name}`, {
        cell: (info) => info.renderValue(),
        header: "Category",
      }),
      columnHelper.accessor("subCategory", {
        id: "subCategory",
        cell: (info) => info.renderValue(),
        header: "Sub-category",
      }),
      columnHelper.accessor("totalTime", {
        id: "totalTime",
        cell: (info) => info.renderValue(),
        header: "Time spent",
      }),
    ],
    []
  );

  useEffect(() => {
    if (reportApiData?.data) {
      setReportRows(reportApiData?.data);
    }
  }, [reportApiData]);
  console.log("reportApiData", reportApiData);
  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>
      {/* Search form starts */}
      <div className="mt-3">
        <ReportSearch
          reportSearchPayload={reportSearchPayload}
          setReportSearchPayload={setReportSearchPayload}
        />
      </div>
      {/* Search form ends */}
      <div className="mt-4 flex flex-col">
        <div className="w-full md:flex">
          {/* Grid starts */}
          <div className="py-2 md:w-1/2">
            <Table columns={columns} data={reportRows} />
          </div>
          {/* Grid ends */}
          {/* Graph starts */}
          <div className="py-2 md:w-1/2">
            <ReportGraph />
          </div>
          {/* Graph ends */}
        </div>
      </div>
    </div>
  );
};
