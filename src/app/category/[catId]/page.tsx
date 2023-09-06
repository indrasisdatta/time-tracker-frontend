"use client";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CategoryForm } from "../CategoryForm";
import { getCategory } from "@/services/CategoryService";
import { Category } from "@/models/Category";

const queryClient = new QueryClient();

const CategoryUpdate = ({ params }: { params: { catId: string } }) => {
  /* Category data to populate in edit form */
  const [categoryData, setCategoryData] = useState<Category>({
    _id: "",
    name: "",
    description: "",
    subCategories: [{ _id: "", name: "", description: "" }],
  });

  useEffect(() => {
    /* Get category info to populate inputs */
    (async () => {
      if (params.catId) {
        const category = await getCategory(params.catId);
        console.log("category", category);
        if (category.data.status == 1 && category.data.data) {
          const { _id, name, description, subCategories } = category.data.data;
          setCategoryData({ _id, name, description, subCategories });
        }
      }
    })();
  }, []);

  const router = useRouter();

  console.log("categoryData", categoryData);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto mb-4">
        <h1 className="text-xl font-bold flex">
          <Link href="" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-8 w-5 stroke-4" />
          </Link>
          <span className="ml-3">Edit Category</span>
        </h1>
      </div>
      <CategoryForm
        defaultValues={{
          name: "",
          description: "",
          subCategories: [{ name: "", description: "" }],
        }}
        category={categoryData}
      />
    </QueryClientProvider>
  );
};

export default CategoryUpdate;
