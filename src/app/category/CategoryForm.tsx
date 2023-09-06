import { Loader } from "@/app/common/components/Loader";
import { Category, CategoryAddFormValues } from "@/models/Category";
import { addCategory, updateCategory } from "@/services/CategoryService";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { useMutation } from "react-query";

type CategoryFormProps = {
  defaultValues: CategoryAddFormValues;
  category: Category | null;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  defaultValues,
  category,
}: {
  defaultValues: CategoryAddFormValues;
  category: Category | null;
}) => {
  /* React hook form initialized */
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryAddFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
        subCategories: category?.subCategories,
      });
    }
  }, [category, reset]);

  /* Form submit API call */
  const saveCategory = async (
    formData: CategoryAddFormValues
  ): Promise<any> => {
    if (category && category?._id) {
      const { data } = await updateCategory(formData, category?._id);
      console.log("Update data", data);
      return data;
    }
    const { data } = await addCategory(formData);
    return data;
  };

  /* useMutation hook from react-query is called to handle API call and maintain different states (error, data, loading etc)  */
  const { mutate, data, error, isError, isLoading } = useMutation(saveCategory);

  const router = useRouter();

  console.log("Mutation result", data, error);

  /* Based on form submit API response, show error toast or redirect to category URL */
  if (isError) {
    toast.error(`Error: ${(error as any).response?.data?.error.join(", ")}`, {
      duration: 5000,
      style: {
        maxWidth: "30em",
      },
    });
  } else if (data) {
    // toast.success("Category saved successful");
    // redirect("/category");
    const op = !!category && category?._id ? "update" : "add";
    router.push(`/category?op=${op}`);
    setTimeout(() => {
      toast.success("Category saved", {
        position: "top-right",
        // autoClose: 5000,
      });
    }, 1);
  }

  /**
   * Needed for multiple inputs of Subcategories
   * Provides in built functions:
   *  append for adding rows, remove for deleting rows
   */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });

  /* Check if field has any error */
  const hasError = (field: string) => {
    return errors && field in errors;
  };

  console.log("Errors: ", errors);

  /**
   * Get each input's div class based on field and error/valid status
   * @param field string - Form field name
   * @returns string - class name of input
   */
  const getInputClass = (field: string) => {
    let commonClasses = `w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md focus-within:ring-1 focus-within:ring-inset focus-visible:outline-none `;
    if (hasError(field)) {
      commonClasses += `focus-within:ring-red-800`;
    } else {
      commonClasses += `focus-within:ring-blue-800 dark:focus-within:ring-blue-400`;
    }
    return commonClasses;
  };

  /**
   * Get each input's parent div class based on field and error/valid status
   * @param field string - Form field name
   * @returns string - class name of input parent div
   */
  const getInputDivClass = (field: string) => {
    let classes = `rounded-md shadow-sm ring-1 ring-inset focus:outline-0 `;

    switch (field) {
      case "name":
        classes += `flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm `;
        break;
      case "subCategories":
        classes = `flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-xs `;
        break;
      case "description":
        classes += `sm:max-w-full focus:ring `;
      // classes +=
      // "rounded-md shadow-sm focus:ring focus:ring-offset ring-1 ring-inset ring-gray-300 focus:ring-blue-800 dark:focus:ring-blue-400 ";
    }
    if (hasError(field)) {
      classes += "ring-red-600";
    } else {
      classes += "ring-gray-300";
    }
    return classes;
  };

  /* Form submit action - call mutate function of react-query */
  const onSubmit = (formData: CategoryAddFormValues) => {
    console.log("Submitted data", formData);
    mutate(formData);
  };

  return (
    <div>
      <Toaster />
      {isLoading && <Loader className="m-auto mt-3" />}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="md:flex mb-4">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="name"
              className={`block text-sm font-medium leading-6 ${
                hasError("title")
                  ? "text-red-600"
                  : "text-gray-900 dark:text-gray-200"
              }`}
            >
              Category Name
            </label>
            <div className="mt-1">
              <div className={getInputDivClass("name")}>
                <input
                  type="text"
                  id="name"
                  className={getInputClass("name")}
                  placeholder="Category Name"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Category name is required",
                    },
                    minLength: {
                      value: 2,
                      message: "Category name should have minimum 2 characters",
                    },
                  })}
                />
              </div>
              {errors?.name && (
                <span className="inline-flex text-sm text-red-700">
                  {errors?.name?.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="w-full">
            <label
              htmlFor="description"
              className={`block text-sm font-medium leading-6 ${
                hasError("description")
                  ? "text-red-600"
                  : "text-gray-900 dark:text-gray-200"
              }`}
            >
              Description
            </label>
            <div className="mt-1">
              <div className={`${getInputDivClass("description")} sm:w-9/12`}>
                <textarea
                  id="description"
                  className={`${getInputClass("description")}`}
                  placeholder="Category Description"
                  {...register("description", {
                    // required: {
                    //   value: true,
                    //   message: "Description is required",
                    // },
                  })}
                />
              </div>
              {errors?.description && (
                <span className="inline-flex text-sm text-red-700">
                  {errors?.description?.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="md:flex mb-4">
          <div className="w-full md:w-9/12">
            <label className={`block text-sm font-medium leading-6`}>
              Sub categories
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="mt-3 md:flex gap-4">
                <div className="w-full md:w-3/12">
                  <div className={getInputDivClass("subCategoryName")}>
                    <input
                      type="text"
                      className={getInputClass("subCategoryName")}
                      placeholder="Name"
                      {...register(`subCategories.${index}.name` as any, {
                        required: {
                          value: true,
                          message: "Sub-category name is required",
                        },
                        minLength: {
                          value: 2,
                          message: "Enter minimum 2 characters",
                        },
                      })}
                    />
                  </div>
                  {errors?.subCategories &&
                    errors?.subCategories[index as any]?.name && (
                      <span className="inline-flex text-sm text-red-700">
                        {errors?.subCategories[index as any]?.name?.message}
                      </span>
                    )}
                </div>
                <div className="w-full md:w-8/12 mt-2 md:mt-0">
                  <div
                    className={`${getInputDivClass("subcategoryDescription")}`}
                  >
                    <input
                      type="text"
                      className={`${getInputClass("description")}`}
                      placeholder="Description"
                      {...register(`subCategories.${index}.description` as any)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/12 mt-2 md:mt-0 md:text-right">
                  {index === 0 && (
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded w-full md:w-auto md:d-flex justify-content-right"
                      onClick={() => append({ name: "", description: "" })}
                      data-testid={`add-btn-${index}`}
                    >
                      <PlusIcon className="h-4 w-4 hidden md:block" />
                      <span className="md:hidden font-normal text-sm">Add</span>
                    </button>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded  w-full md:w-auto md:d-flex justify-content-right"
                      onClick={() => remove(index)}
                      data-testid={`del-btn-${index}`}
                    >
                      <TrashIcon className="h-4 w-4 hidden md:block" />
                      <span className="md:hidden font-normal text-sm">
                        Delete
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-x-6">
          <button
            disabled={isLoading}
            type="submit"
            className="w-full md:w-auto md:d-flex rounded-md block bg-indigo-600 px-3 py-1 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
