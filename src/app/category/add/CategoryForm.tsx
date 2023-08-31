import { Loader } from "@/app/common/components/Loader";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

type FormValues = {
  name: string;
  description: string;
  subCategories: [{ name: string; description: string }];
};
type CategoryFormProps = {
  defaultValues: FormValues;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  defaultValues,
}: {
  defaultValues: FormValues;
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });

  const hasError = (field: string) => {
    return errors && field in errors;
  };

  const getInputClass = (field: string) => {
    let commonClasses = `w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md focus-within:ring-1 focus-within:ring-inset focus-visible:outline-none `;
    if (hasError(field)) {
      commonClasses += `focus-within:ring-red-800`;
    } else {
      commonClasses += `focus-within:ring-blue-800 dark:focus-within:ring-blue-400`;
    }
    return commonClasses;
  };

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

  const onSubmit = () => {};

  return (
    <div>
      {/* {isLoading && <Loader className="m-auto mt-3" />} */}
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
                    required: {
                      value: true,
                      message: "Description is required",
                    },
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
              <div key={field.id} className="mt-1 flex gap-4">
                <div className="w-3/12">
                  <div className={getInputDivClass("subCategoryName")}>
                    <input
                      type="text"
                      id="name"
                      className={getInputClass("subCategoryName")}
                      placeholder="Name"
                      {...register("name", {
                        required: {
                          value: true,
                          message: "Sub-category name is required",
                        },
                      })}
                    />
                  </div>
                </div>
                <div className="w-8/12">
                  <div
                    className={`${getInputDivClass("subcategoryDescription")}`}
                  >
                    <input
                      type="text"
                      id="description"
                      className={`${getInputClass("description")}`}
                      placeholder="Description"
                      {...register("description", {
                        required: {
                          value: true,
                          message: "Subcategory Description is required",
                        },
                      })}
                    />
                  </div>
                </div>
                <div className="w-1/12 text-right">
                  {index === 0 && (
                    <button
                      type="button"
                      className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded d-flex justify-content-right"
                      onClick={() => append({ tag: "" })}
                      data-testid={`del-btn-${index}`}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded d-flex justify-content-right"
                      onClick={() => remove(index)}
                      data-testid={`del-btn-${index}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-x-6">
          <button
            // disabled={isLoading}
            type="submit"
            className="rounded-md block bg-indigo-600 px-3 py-1 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
