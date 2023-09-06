"use client";
import Link from "next/link";
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader } from "../common/components/Loader";
import { deleteCategory, getCategories } from "@/services/CategoryService";
import { useQuery } from "react-query";
import { Category } from "@/models/Category";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Prompt from "../common/components/Prompt";

const CategoryList = () => {
  // const pathname = usePathname();
  const searchParams = useSearchParams();

  const toastMsgRef = useRef(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  /* Maintain category list state to store API list as well as internal operations (eg. delete will remove from this list without making api call) */
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const onSubmitModal = async () => {
    console.log("Delete cat", selectedCat);
    if (!selectedCat) {
      setSelectedCat(null);
      setShowModal(false);
      toast.error("Something went wrong. Please try again later.");
      return;
    }
    /* API call to delete */
    const { data } = await deleteCategory(selectedCat._id);
    console.log("Delete resp", data);
    setSelectedCat(null);
    setShowModal(false);
    if (data.status) {
      /* Remove category from table */
      let tempCatList = structuredClone(categoryList);
      tempCatList = tempCatList.filter((cat) => cat._id !== selectedCat._id);
      setCategoryList(tempCatList);
      toast.success("Category deleted successfully");
    } else {
      toast.error("Category delete error: " + data.error.join(""));
    }
  };

  const onCloseModal = async () => {
    setSelectedCat(null);
    setShowModal(false);
  };

  const onSubmitModalCallback = useCallback(onSubmitModal, [selectedCat]);
  const onCloseModalCallback = useCallback(onCloseModal, []);

  /* Show success message for category add, edit */
  for (let param of searchParams) {
    // console.log("Param", param);
    if (
      param[0] === "op" &&
      param[1] === "add" &&
      (!toastMsgRef || !toastMsgRef.current) &&
      typeof window !== undefined
    ) {
      toastMsgRef.current = true;
      console.log("Toast message for add");
      // setTimeout(() => {
      // toast.success("Category added successfully");
      // }, 3000);
    } else if (
      param[0] === "op" &&
      param[1] === "update" &&
      (!toastMsgRef || !toastMsgRef.current) &&
      typeof window !== undefined
    ) {
      toastMsgRef.current = true;
      console.log("Toast message for update");
      // setTimeout(() => {
      // toast.success("Category updated successfully");
      // }, 3000);
    }
  }
  /* API call */
  const fetchCategories = async () => {
    const { data } = await getCategories();
    return data;
  };
  /* Store API result in 'categories' key and destructure returned object */
  const { isSuccess, isError, isLoading, data, error } = useQuery(
    "categories",
    fetchCategories
  );

  /* Every time react-query data changes, update local state */
  useEffect(() => {
    setCategoryList(data?.data);
  }, [data]);

  /* Delete */
  const handleDelete = async (e: SyntheticEvent, cat: Category) => {
    setSelectedCat(cat);
    setShowModal(true);
  };

  // console.log("API category data", data);

  return (
    <div className="container mx-auto">
      <Toaster />
      <Prompt
        title={"Delete category?"}
        message={`Are you sure you want to delete this category?`}
        category={selectedCat}
        setShowModal={setShowModal}
        showModal={showModal}
        onSubmitModal={onSubmitModalCallback}
        onCloseModal={onCloseModalCallback}
      />
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Category List</h1>
        <Link
          href={"/category/add"}
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
              ? categoryList?.map((cat: Category, k: number) => (
                  <tr key={cat._id} className="even:bg-blue-gray-50/50">
                    <td className="p-2">{k + 1}</td>
                    <td className="p-2">{cat.name}</td>
                    <td className="p-2">
                      {cat.subCategories?.map((sub) => sub.name).join(", ")}
                    </td>
                    <td className="text-right cat-actions w-7 p-2">
                      <Link href={`/category/${cat._id}`} className="mr-2">
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        href=""
                        onClick={(e) => {
                          handleDelete(e, cat);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
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
