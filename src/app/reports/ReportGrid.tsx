import Link from "next/link";
import React, { useMemo } from "react";
import { ReportSearch } from "./ReportSearch";
import { Table } from "../common/components/tables/Table";
import { ReportGrid as Report } from "@/models/Report";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

export const ReportGrid = () => {
  const columnHelper = createColumnHelper<Report>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("category", {
        id: "category",
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

  const data = [
    {
      category: "Self Learn",
      subCategory: "Next.js",
      totalTime: 650,
    },
    {
      category: "CTS",
      subCategory: "Verizon",
      totalTime: 440,
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>
      <div className="mt-3">
        <ReportSearch />
      </div>
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <Table columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};
