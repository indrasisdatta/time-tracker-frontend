import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import React, { useState } from "react";

const sortObj: any = {
  asc: " 🔼",
  desc: " 🔽",
};

export const Table = ({ columns, data }: { columns: any; data: any }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  console.log("Header groups", getHeaderGroups());
  console.log("Row model", getRowModel());
  console.log("Sorting", sorting);
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup?.headers.map((header) => (
                <th key={header.id}>
                  <span
                    className={
                      header.column.getCanSort() ? "cursor-pointer" : "none"
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {sortObj[header.column.getIsSorted() as string]}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
