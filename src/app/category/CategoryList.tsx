"use client";
import Link from "next/link";
import React from "react";
import { Loader } from "../common/components/Loader";
import { getCategories } from "@/services/CategoryService";
import { useQuery, QueryClient } from "react-query";
import { Category } from "@/models/Category";
import { PencilIcon } from "@heroicons/react/20/solid";

const CategoryList = () => {
  const fetchCategories = async () => {
    const { data } = await getCategories();
    return data;
  };

  const { isSuccess, isError, isLoading, data, error } = useQuery(
    "categories",
    fetchCategories
  );

  console.log("API category data", data);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Category List</h1>

        <Link
          href={"/product/add"}
          className="rounded-md block bg-indigo-600 px-3 py-2 text-md text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add Category
        </Link>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
                #
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
                Title
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
                Sub-categories
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody data-testid="product-table">
            {isError ? (
              <tr>
                <td className="text-center p-12" colSpan={5}>
                  Error fetching records{" "}
                  {(error as Error)?.message as React.ReactNode}
                </td>
              </tr>
            ) : null}
            {isLoading ? (
              <tr data-testid="loader">
                <td className="text-center" colSpan={5}>
                  <Loader className="mt-14" />
                </td>
              </tr>
            ) : null}
            {isSuccess
              ? data?.data?.map((cat: Category, k: number) => (
                  <tr key={cat._id} className="even:bg-blue-gray-50/50">
                    <td className="p-2">{k + 1}</td>
                    <td className="p-2">{cat.name}</td>
                    <td className="p-2">
                      {cat.subCategories?.map((sub) => sub.name).join(", ")}
                    </td>
                    <td className="text-right w-5 p-2">
                      <Link
                        href={`/category/${cat._id}`}
                        className="text-right"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
