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
  Row,
} from "@tanstack/react-table";
import { ReportGraph } from "./ReportGraph";
import {
  convertToHrMin,
  getStartEndDateOfMonth,
  getSubcatName,
  reportDateRangeDisplay,
} from "@/utils/helper";
import { useQuery } from "react-query";
import { reportData } from "@/services/ReportService";
import { ReactSelectType } from "@/models/Timesheet";
import { Loader } from "../common/components/Loader";

export const Report = ({ reportDateRange }: { reportDateRange: string[] }) => {
  console.log("Report date range", reportDateRange);

  /* Search payload used to fetch data for both grid and chart */
  const [reportSearchPayload, setReportSearchPayload] =
    useState<ReportSearchFormValues>(() => {
      let tempState = {
        category: "",
        subCategory: "",
        dateRange: { startDate: "", endDate: "" },
      };
      /* If reportDateRange prop sends date (in URL param) then set state as this date, otherwise show default date */
      return reportDateRangeDisplay(reportDateRange, tempState);
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
    refetchOnWindowFocus: false,
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
        cell: (info) => {
          return getSubcatName(
            info.row?.original?.categoryData,
            info.getValue()
          );
        },
        sortingFn: (rowA: Row<any>, rowB: Row<any>, columnId: string) => {
          console.log("Sorting FN", rowA, rowB, columnId);
          const subcat1 = getSubcatName(
            rowA?.original?.categoryData,
            rowA?.getValue(columnId)
          );
          const subcat2 = getSubcatName(
            rowB?.original?.categoryData,
            rowB?.getValue(columnId)
          );
          return subcat1.localeCompare(subcat2);
        },
        header: "Sub-category",
      }),
      columnHelper.accessor("totalTime", {
        id: "totalTime",
        cell: (info) => {
          return convertToHrMin(info.getValue(), true);
        },
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

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>
      {/* Search form starts */}
      <div className="mt-3">
        <ReportSearch
          reportDateRange={reportDateRange}
          reportSearchPayload={reportSearchPayload}
          setReportSearchPayload={setReportSearchPayload}
        />
      </div>
      {/* Search form ends */}
      <div className="mt-4 flex flex-col">
        <div className="w-full md:flex">
          {/* Loading data */}
          {isLoadingReport && (
            <div className="w-full">
              <Loader className="m-auto my-8 flex" />
            </div>
          )}
          {/* Error message */}
          {isErrorReport && (
            <>
              <div className="py-2 w-full">
                <div className="m-auto my-3 text-center">
                  <p className="mb-3">
                    {(reportError as Error)?.message
                      ? (reportError as Error).message
                      : "Something went wrong. Please try again later."}
                  </p>
                </div>
              </div>
            </>
          )}
          {/* Success */}
          {reportApiData && (
            <>
              {/* Grid starts */}
              <div className="py-2 md:w-1/2">
                <Table columns={columns} data={reportRows} />
              </div>
              {/* Grid ends */}
              {/* Graph starts */}
              <div className="py-2 md:w-1/2">
                <ReportGraph reportRows={reportRows} />
              </div>
              {/* Graph ends */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
