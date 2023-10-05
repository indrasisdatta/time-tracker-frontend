import { ReportSearchFormValues } from "@/models/Report";
import React, { useState, useReducer, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import Datepicker, {
  DateType,
  DateValueType,
} from "react-tailwindcss-datepicker";
import "./report.scss";
import { PrimaryButton } from "../common/components/buttons/PrimaryButton";
import { AltButton } from "../common/components/buttons/AltButton";
import { useQuery } from "react-query";
import { getCategories } from "@/services/CategoryService";
import { Category, SubCategory } from "@/models/Category";

type DropdownOptions = {
  categoryList: any;
  subCategoryList: any;
};
const defaultDropdownOptions = {
  categoryList: [],
  subCategoryList: [],
};
const defaultFormValues = {
  category: "",
  subCategory: "",
  dateRange: { startDate: "", endDate: "" },
};

export const ReportSearch = ({
  reportSearchPayload,
  setReportSearchPayload,
}: {
  reportSearchPayload: ReportSearchFormValues;
  setReportSearchPayload: React.Dispatch<
    React.SetStateAction<ReportSearchFormValues>
  >;
}) => {
  /* Reducer to store category and subcategory dropdown values */
  const dropdownOptionsReducer = (
    state: DropdownOptions,
    action: { type: string; payload: any }
  ) => {
    switch (action.type) {
      case "CATEGORY_LOAD":
        return { ...state, categoryList: action.payload };
      case "CATEGORY_SELECT":
        console.log("Cat select");
        let subCats: any[] = [];
        let matchingCat = state.categoryList.find(
          (cat: any) => cat.value === action.payload.catId
        );
        if (matchingCat) {
          matchingCat.subCategories?.forEach((subCat: SubCategory) => {
            subCats.push({
              value: subCat._id,
              label: subCat.name,
              isProductive: subCat.isProductive,
            });
          });
        }
        return {
          ...state,
          subCategoryList: subCats,
        };
      default:
        return state;
    }
  };
  const [dropdownOptions, dispatchDropdownOptions] = useReducer(
    dropdownOptionsReducer,
    defaultDropdownOptions
  );
  const [dateRangeInput, setDateRangeInput] = useState<{
    startDate: null | string;
    endDate: null | string;
  }>({
    startDate: null,
    endDate: null,
  });
  /* API call */
  const fetchCategories = async () => {
    const { data } = await getCategories();
    return data;
  };

  /* Category, subcategory dropdown value status based on API result */
  const {
    isLoading: isLoadingCat,
    data: categoryData,
    error: errorCat,
    isError: isErrorCat,
  } = useQuery("categoryList", fetchCategories, {
    refetchOnWindowFocus: false,
    staleTime: 15 * 60 * 1000, // 15 mins
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ReportSearchFormValues>({
    // defaultValues: defaultFormValues,
    defaultValues: reportSearchPayload,
  });

  const onSubmit = (formData: ReportSearchFormValues) => {
    console.log("Search submit", formData);
  };

  const handleReset = () => {
    reset(defaultFormValues);
    setDateRangeInput({ startDate: null, endDate: null });
  };

  /* On initial load, populate datepicker with props value */
  useEffect(() => {
    if (reportSearchPayload && reportSearchPayload?.dateRange) {
      setDateRangeInput(reportSearchPayload?.dateRange);
    }
  }, []);

  /* Update reducer once category API response is obtained */
  useEffect(() => {
    if (
      dropdownOptions.categoryList.length === 0 &&
      categoryData &&
      categoryData?.status == 1 &&
      categoryData?.data?.length > 0
    ) {
      console.log("Category load");
      dispatchDropdownOptions({
        type: "CATEGORY_LOAD",
        payload: categoryData.data.map((cat: Category) => ({
          value: cat._id,
          label: cat.name,
          subCategories: cat.subCategories,
        })),
      });
    }
  }, [categoryData]);

  /* Category, subcategory change event handler */
  const handleChange = (type: string, selectedOption: any) => {
    console.log("Change handler:", type, selectedOption);
    if (type === "category") {
      /* Reset the subcategory value when the category changes */
      setValue(`subCategory`, "");
      dispatchDropdownOptions({
        type: "CATEGORY_SELECT",
        payload: { catId: selectedOption.value },
      });
    } else if (type === "dateRange") {
      setDateRangeInput(selectedOption);
      setValue(`dateRange`, selectedOption);
    }
  };

  return (
    <div>
      <form
        id="report-search-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="md:flex gap-x-2">
          {/* Category  */}
          <div className="w-full md:w-3/12">
            <Controller
              control={control}
              name={`category`}
              //   rules={{
              //     required: {
              //       value: true,
              //       message: "Select category",
              //     },
              //   }}
              render={({ field: { onChange, value } }) => (
                <Select
                  primaryColor={"indigo"}
                  placeholder="Select category"
                  value={value as any as SelectValue}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    handleChange("category", selectedOption);
                  }}
                  isSearchable={true}
                  options={dropdownOptions?.categoryList}
                  classNames={{
                    menuButton: () =>
                      `select-text rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-sm ring-gray-300`,
                    menu: "absolute z-10 w-full shadow-lg border rounded py-1 text-sm text-gray-900 dark:text-gray-200 dark:bg-slate-800",
                    list: "opt-div dark:bg-slate-800",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-1.5 cursor-pointer select-none truncate rounded ${
                        isSelected
                          ? `text-white bg-blue-500`
                          : `text-gray-900 dark:text-gray-200 
                                hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`
                      }`,
                    searchBox:
                      "w-full border-0 bg-transparent py-1.5 pl-8 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md focus-within:ring-1 focus-within:ring-inset focus-visible:outline-none focus-within:ring-blue-800 dark:focus-within:ring-blue-400",
                  }}
                />
              )}
            />
          </div>
          {/* Subcategory */}
          <div className="w-full md:w-3/12 mt-2 md:mt-0">
            <Controller
              control={control}
              name={`subCategory`}
              //   rules={{
              //     required: {
              //       value: true,
              //       message: "Select sub-category",
              //     },
              //   }}
              render={({ field: { onChange, value } }) => (
                <Select
                  primaryColor={"indigo"}
                  placeholder="Select sub-category"
                  value={value as any as SelectValue}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    handleChange("subCategory", selectedOption);
                  }}
                  isSearchable={true}
                  options={dropdownOptions?.subCategoryList}
                  classNames={{
                    menuButton: () =>
                      `select-text rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ring-gray-300`,
                    menu: "absolute z-10 w-full shadow-lg border rounded py-1 text-sm text-gray-900 dark:text-gray-200 dark:bg-slate-800",
                    list: "opt-div dark:bg-slate-800",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-1.5 cursor-pointer select-none truncate rounded ${
                        isSelected
                          ? `text-white bg-blue-500`
                          : `text-gray-900 dark:text-gray-200 
                                hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`
                      }`,
                    searchBox:
                      "w-full border-0 bg-transparent py-1.5 pl-8 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md focus-within:ring-1 focus-within:ring-inset focus-visible:outline-none focus-within:ring-blue-800 dark:focus-within:ring-blue-400",
                  }}
                />
              )}
            />
          </div>
          {/* Date range */}
          <div className="w-full md:w-3/12 mt-2 md:mt-0 date-container">
            <Controller
              control={control}
              name="dateRange"
              rules={{
                required: {
                  value: true,
                  message: "Select date range",
                },
              }}
              render={({
                field: {
                  onChange,
                  // value, ref
                },
                // fieldState: { invalid, isTouched, isDirty, error },
                // formState,
              }) => (
                <Datepicker
                  placeholder={"Select date"}
                  asSingle={false}
                  useRange={true}
                  value={dateRangeInput}
                  onChange={(newValue) => {
                    onChange(newValue?.startDate);
                    handleChange("dateRange", newValue);
                  }}
                  maxDate={new Date()}
                  displayFormat={"DD/MM/YYYY"}
                  readOnly={true}
                  //   focus-within:ring-1 focus-within:ring-inset
                  /* hasError("timesheetDate")
                          ? "ring-red-600"
                          : "ring-gray-300" */
                  inputClassName="w-full flex-1 border-0 bg-transparent py-[0.41rem] pl-2.5 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md  focus-visible:outline-none"
                  containerClassName={`rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex sm:max-w-sm ring-gray-300`}
                  toggleClassName="mr-2 mb-1"
                />
              )}
            />
          </div>

          {/* Search, reset buttons */}
          <div className="flex w-full md:w-3/12 mt-3 md:mt-0 justify-end">
            <AltButton
              type="button"
              text="Reset"
              className={"w-1/2 md:w-auto"}
              onClick={handleReset}
            />
            <PrimaryButton
              type="submit"
              text="Search"
              className={"w-1/2 md:w-auto"}
              onClick={() => {
                console.log("Search");
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
