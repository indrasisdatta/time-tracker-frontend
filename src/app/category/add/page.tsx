"use client";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { CategoryForm } from "../CategoryForm";
import { QueryClient, QueryClientProvider } from "react-query";

const AddCategory: React.FC = () => {
  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto mb-4">
        <h1 className="text-xl font-bold flex">
          <Link href="" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-8 w-5 stroke-4" />
          </Link>
          <span className="ml-3">Add Category</span>
        </h1>
      </div>
      <CategoryForm
        defaultValues={{
          name: "",
          description: "",
          subCategories: [{ name: "", description: "" }],
        }}
        category={null}
      />
    </QueryClientProvider>
  );
};

export default AddCategory;
