"use client";
import React, { memo, useEffect, useReducer, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Datepicker, {
  DateType,
  DateValueType,
} from "react-tailwindcss-datepicker";
import "../../calendar.scss";
import {
  DocumentCheckIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import Select from "react-tailwindcss-select";
import { getCategories } from "@/services/CategoryService";
import {
  QueryFunctionContext,
  QueryKey,
  useMutation,
  useQuery,
} from "react-query";
import { Category, SubCategory } from "@/models/Category";
import { TimesheetPayload, Timeslot } from "@/models/Timesheet";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { calculateTimeDifference, summaryTime } from "@/utils/helper";
import { Loader } from "@/app/common/components/Loader";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import {
  getTimesheetDatewise,
  saveTimesheet,
} from "@/services/TimesheetService";
import TimesheetSummary from "./TimesheetSummary";
import moment from "moment";

type DropdownOptions = {
  categoryList: any;
  subCategoryList: any;
};

const defaultDropdownOptions = {
  categoryList: [],
  subCategoryList: [],
};
const defaultTimesheetFormData: TimesheetPayload = {
  timesheetDate: "",
  timeslots: [],
};

const TimesheetFormComponent = ({
  timesheetDateProp,
}: {
  timesheetDateProp: DateType;
}) => {
  const [timesheetDate, setTimesheetDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const saveTimesheetApi = async (payload: TimesheetPayload): Promise<any> => {
    const { data } = await saveTimesheet(payload);
    return data;
  };

  const {
    mutate,
    data: savedData,
    isLoading: isLoadingSave,
    isError: isSaveError,
    error: saveError,
  } = useMutation(saveTimesheetApi, {
    onSuccess: () => {
      toast.success("Timesheet saved");
      // redirect("/calendar");
    },
    onError: () => {
      toast.error(
        `Error: ${(saveError as any).response?.data?.error.join(", ")}`,
        {
          duration: 5000,
          style: {
            maxWidth: "30em",
          },
        }
      );
    },
  });

  /* Fetch timesheet data based on selected date */
  const getTimesheetDatewiseApi = async ({
    queryKey,
  }: {
    queryKey: QueryKey;
  }): Promise<any> => {
    // console.log("getTimesheetDatewiseApi Query params", queryKey[1]);
    if (
      queryKey[1] &&
      queryKey[1].hasOwnProperty("startDate") &&
      (queryKey[1] as any)?.startDate
    ) {
      const { data } = await getTimesheetDatewise(
        timesheetDate?.startDate?.toString() || ""
      );
      return data;
    }
  };
  /* Store API result in 'timesheetData' key and destructure returned object */
  const {
    isSuccess: isSuccessTimesheetData,
    isError: isErrorTimesheetData,
    isLoading: isLoadingTimesheetData,
    data: timesheetData,
    error: errorTimesheetData,
    refetch: refetchTimesheetData,
  } = useQuery(["timesheetData", timesheetDate], getTimesheetDatewiseApi, {
    // refetchOnWindowFocus: false,
    // enabled: false,
    // manual: true,
  });
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
        const subcatList = structuredClone(state.subCategoryList);
        subcatList[action.payload.index] = subCats;
        return {
          ...state,
          subCategoryList: subcatList,
        };
      default:
        return state;
    }
  };

  const [dropdownOptions, dispatchDropdownOptions] = useReducer(
    dropdownOptionsReducer,
    defaultDropdownOptions
  );

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
  });

  /* Initialize React hook form */
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<TimesheetPayload>({ defaultValues: defaultTimesheetFormData });

  /* In built react-hook function to add, remove rows */
  const {
    fields: timeslotFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "timeslots",
  });

  /* Based on date prop, populate input (and subsequently load data) */
  useEffect(() => {
    if (timesheetDateProp) {
      console.log("timesheetDateProp:", timesheetDateProp);
      setTimesheetDate({
        startDate: timesheetDateProp,
        endDate: timesheetDateProp,
      });
      setValue(`timesheetDate`, timesheetDateProp.toString());
      refetchTimesheetData();
    }
  }, [timesheetDateProp]);

  /* Every time timesheet API data is fetched, update form to populate data */
  useEffect(() => {
    if (
      timesheetData &&
      timesheetData?.status === 1 &&
      timesheetData?.data?.length > 0
    ) {
      const savedTimeslots = timesheetData.data.map(
        (
          {
            startTimeLocal,
            endTimeLocal,
            category,
            subCategory,
            isProductive,
          }: {
            startTimeLocal: Date;
            endTimeLocal: Date;
            category: Category;
            subCategory: string;
            isProductive: boolean;
          },
          index: number
        ) => {
          /* Dispatch category select so that subcat dropdown options are populated */
          dispatchDropdownOptions({
            type: "CATEGORY_SELECT",
            payload: { index, catId: category._id },
          });
          return {
            startTime: moment(startTimeLocal).format("HH:mm"),
            endTime: moment(endTimeLocal).format("HH:mm"),
            category: { value: category._id, label: category.name },
            subCategory: category?.subCategories
              .filter((subCat) => subCat._id === subCategory)
              .map((subCat) => ({
                value: subCat._id,
                label: subCat.name,
                isProductive: subCat.isProductive,
              }))[0],
            isProductive: !!isProductive,
          };
        }
      );
      reset({
        timesheetDate: moment(timesheetData.data[0].timesheetDate).format(
          "YYYY-MM-DD"
        ),
        timeslots: savedTimeslots,
      });
    } else {
      reset({
        ...defaultTimesheetFormData,
        timesheetDate: timesheetDate?.startDate?.toString(),
      });
    }
  }, [timesheetData]);

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

  /* Timeslots input change event handler */
  const handleChange = (index: number, type: string, selectedOption: any) => {
    console.log("Change handler:", index, type, selectedOption);
    switch (type) {
      case "category":
        /* Reset the subcategory value when the category changes */
        setValue(`timeslots.${index}.subCategory`, "");
        dispatchDropdownOptions({
          type: "CATEGORY_SELECT",
          payload: { index, catId: selectedOption.value },
        });
        break;
      case "subCategory":
        setValue(
          `timeslots.${index}.isProductive`,
          selectedOption.isProductive
        );
        break;
    }
  };

  /* Date change event handler */
  const handleDateChange = (newValue: DateValueType) => {
    console.log("newValue:", newValue);
    setTimesheetDate(newValue);
    setValue(`timeslots`, []);
    refetchTimesheetData();
  };

  const formValues = getValues();

  console.log("categoryData", categoryData);
  console.log("dropdownOptions", dropdownOptions);
  console.log("Form errors", errors);
  console.log("Form values", formValues);
  console.log("Timesheet data", timesheetData);

  const addRow = () => {
    /* Next row start time should match prev row end time */
    const timeslotsLen = formValues.timeslots.length;
    let startTime = "";
    if (timeslotsLen > 0) {
      startTime = formValues.timeslots[timeslotsLen - 1].endTime;
    }
    append({
      startTime,
      endTime: "",
      category: "",
      subCategory: "",
      isProductive: false,
    });
  };

  const onSubmit = (formData: TimesheetPayload) => {
    // console.log("Form submitted errors", errors, formValues, formData);
    const payload = structuredClone(formData);
    payload.timeslots?.map((row) => {
      row.category =
        typeof row.category === "object" ? row.category?.value : "";
      row.subCategory =
        typeof row.subCategory === "object" ? row.subCategory?.value : "";
      // row.comments = null;
    });
    console.log("Payload: ", payload);
    mutate(payload);
  };

  const hasError = (field: string) => {
    // console.log("Check hasError", field, errors);
    if (field.includes("timeslots")) {
      const [fieldName, index, subField] = field.split(".");
      if (
        errors &&
        errors.hasOwnProperty(fieldName) &&
        (errors as any)?.[fieldName]?.[index]?.[subField]
      ) {
        return true;
      }
    }
    return errors && field in errors;
  };

  /* Show sub cat selected value only if it's present in dropdown list */
  const subCatSelectedValue = (index: number, value: any): SelectValue => {
    if (
      dropdownOptions?.subCategoryList?.length > 0 &&
      typeof dropdownOptions?.subCategoryList[index] !== "undefined" &&
      value
    ) {
      const subCatPresent = dropdownOptions?.subCategoryList[index].find(
        (subCat: any) => subCat.value === value.value
      );
      return subCatPresent;
    }
    return null;
  };

  return (
    <div>
      <Toaster />
      {(isLoadingSave || isLoadingCat || isLoadingTimesheetData) && (
        <div className="m-auto text-center">
          <Loader className="" />
          <p className="mb-6">
            {isLoadingSave
              ? "Saving timesheet"
              : isLoadingCat || isLoadingTimesheetData
              ? "Initializing form"
              : ""}
          </p>
        </div>
      )}
      {isErrorCat && (
        <div className="m-auto my-3 text-center">
          <p className="mb-3">
            Category load:{" "}
            {(errorCat as Error)?.message
              ? (errorCat as Error).message
              : "Something went wrong. Please try again later."}
          </p>
        </div>
      )}
      {isErrorTimesheetData && (
        <div className="m-auto my-3 text-center">
          <p className="mb-3">
            Timesheet load:{" "}
            {(errorTimesheetData as Error)?.message
              ? (errorTimesheetData as Error).message
              : "Something went wrong. Please try again later."}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="md:flex">
          {/* Col 1: form inputs */}
          <div className="w-full md:w-10/12">
            {/* Date input and add, submit buttons */}
            <div className="md:flex mb-4 ">
              <div className="w-full md:w-1/2 date-container">
                <Controller
                  control={control}
                  name="timesheetDate"
                  rules={{
                    required: {
                      value: true,
                      message: "Select date",
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
                      asSingle={true}
                      useRange={false}
                      value={timesheetDate}
                      onChange={(newValue) => {
                        onChange(newValue?.startDate);
                        handleDateChange(newValue);
                      }}
                      maxDate={new Date()}
                      displayFormat={"DD/MM/YYYY"}
                      readOnly={true}
                      //   focus-within:ring-1 focus-within:ring-inset
                      inputClassName="w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md  focus-visible:outline-none"
                      containerClassName={`rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex sm:max-w-sm ${
                        hasError("timesheetDate")
                          ? "ring-red-600"
                          : "ring-gray-300"
                      }`}
                      //  ring-gray-300
                      toggleClassName="mr-2 mb-1"
                    />
                  )}
                />
                {errors?.timesheetDate && (
                  <span className="inline-flex text-sm text-red-700">
                    {errors?.timesheetDate?.message}
                  </span>
                )}
              </div>
              {/* Add row, save buttons starts */}
              <div className="w-full md:w-1/2  mt-2 md:mt-0">
                <button
                  type="button"
                  // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded md:w-auto md:d-flex justify-content-right pr-3 disabled:opacity-50"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right mr-3"
                  onClick={addRow}
                  disabled={
                    !timesheetDate?.startDate ||
                    isErrorCat ||
                    isErrorTimesheetData ||
                    isLoadingCat ||
                    isLoadingTimesheetData
                  }
                >
                  <PlusIcon className="h-4 w-4 hidden md:block" />
                  <span className="font-normal text-sm">Add entry</span>
                </button>
                <button
                  type="submit"
                  disabled={
                    !timesheetDate?.startDate ||
                    formValues.timeslots.length == 0 ||
                    isLoadingSave
                  }
                  // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded md:w-auto md:d-flex justify-content-right ml-8 pr-3 disabled:opacity-50"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right"
                >
                  {/* <DocumentCheckIcon className="h-4 w-4 hidden md:block" /> */}
                  <span className="font-normal text-sm">Save</span>
                </button>
              </div>
              {/* Add row, save buttons ends */}
            </div>
            {/* Timesheet enry headings */}
            {timeslotFields && timeslotFields.length > 0 && (
              <div className="flex gap-x-12 text-center mb-2">
                <div className="w-full md:w-2/12">Start time</div>
                <div className="w-full md:w-2/12">End time</div>
                <div className="w-full md:w-2/12">Category</div>
                <div className="w-full md:w-3/12">Sub-category</div>
                <div className="w-full md:w-2/12">Duration</div>
                <div className="w-full md:w-2/12"></div>
              </div>
            )}
            {/* Timesheet enry input rows */}
            {timeslotFields.map((field, index) => (
              <div key={field.id} className="flex timeslot-row gap-x-2 mb-3">
                {/* Start time */}
                <div className="w-full md:w-2/12">
                  <Controller
                    control={control}
                    name={`timeslots.${index}.startTime`}
                    rules={{
                      required: {
                        value: true,
                        message: "Select start time",
                      },
                      validate: () => {
                        const validateObj = {
                          value: true,
                          message: "",
                        };
                        let currStartTime = getValues(
                          `timeslots.${index}.startTime`
                        );
                        let currEndTime = getValues(
                          `timeslots.${index}.endTime`
                        );
                        if (
                          !!currStartTime &&
                          !!currEndTime &&
                          currStartTime > currEndTime
                        ) {
                          validateObj.value = false;
                          validateObj.message =
                            "Start time cannot be greater than end time";
                        }
                        if (index > 0) {
                          let prevEndTime = getValues(
                            `timeslots.${Number(index) - 1}.endTime`
                          );
                          console.log(
                            `Row ${index} Validate prev end time ${prevEndTime} with current start time ${currStartTime}`
                          );
                          if (
                            !!currStartTime &&
                            !!prevEndTime &&
                            currStartTime !== prevEndTime
                          ) {
                            validateObj.value = false;
                            validateObj.message = `Not matching previous end time ${prevEndTime}`;
                          }
                        }
                        console.log("Validate obj startTime", validateObj);
                        return validateObj.message.length > 0
                          ? validateObj.message
                          : true;
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <TimePicker
                        value={value}
                        className={`rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex sm:max-w-sm ${
                          hasError(`timeslots.${index}.startTime`)
                            ? "ring-red-600"
                            : "ring-gray-300"
                        }`}
                        format="HH:mm"
                        onChange={(selectedOption) => {
                          onChange(selectedOption);
                          handleChange(index, "startTime", value);
                        }}
                        // value={field.startTime}
                      />
                    )}
                  />
                  {errors?.timeslots && errors?.timeslots[index]?.startTime && (
                    <span className="inline-flex text-sm text-red-700">
                      {errors?.timeslots[index]?.startTime?.message}
                    </span>
                  )}
                </div>
                {/* End time */}
                <div className="w-full md:w-2/12">
                  <Controller
                    control={control}
                    name={`timeslots.${index}.endTime`}
                    rules={{
                      required: {
                        value: true,
                        message: "Select end time",
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <TimePicker
                        value={value}
                        className={`rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex sm:max-w-sm ${
                          hasError(`timeslots.${index}.endTime`)
                            ? "ring-red-600"
                            : "ring-gray-300"
                        }`}
                        format="HH:mm"
                        onChange={(selectedOption) => {
                          onChange(selectedOption);
                          handleChange(index, "endTime", value);
                        }}
                      />
                    )}
                  />
                  {errors?.timeslots && errors?.timeslots[index]?.endTime && (
                    <span className="inline-flex text-sm text-red-700">
                      {errors?.timeslots[index]?.endTime?.message}
                    </span>
                  )}
                </div>
                <div className="w-full md:w-2/12">
                  <Controller
                    control={control}
                    name={`timeslots.${index}.category`}
                    rules={{
                      required: {
                        value: true,
                        message: "Select category",
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        primaryColor={"indigo"}
                        placeholder="Select category"
                        value={value as any as SelectValue}
                        onChange={(selectedOption) => {
                          onChange(selectedOption);
                          handleChange(index, "category", selectedOption);
                        }}
                        isSearchable={true}
                        options={dropdownOptions?.categoryList}
                        classNames={{
                          menuButton: () =>
                            `select-text rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ${
                              hasError(`timeslots.${index}.category`)
                                ? "ring-red-600"
                                : "ring-gray-300"
                            }`,
                          menu: "absolute z-10 w-full shadow-lg border rounded py-1 text-sm text-gray-900 dark:text-gray-200 dark:bg-slate-800",
                          list: "opt-div dark:bg-slate-800",
                          listItem: ({ isSelected }: any) =>
                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
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
                  {errors?.timeslots && errors?.timeslots[index]?.category && (
                    <span className="inline-flex text-sm text-red-700">
                      {errors?.timeslots[index]?.category?.message}
                    </span>
                  )}
                </div>
                <div className="w-full md:w-2/12">
                  <Controller
                    control={control}
                    name={`timeslots.${index}.subCategory`}
                    rules={{
                      required: {
                        value: true,
                        message: "Select sub-category",
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        primaryColor={"indigo"}
                        placeholder="Select sub-category"
                        // value={value as any as SelectValue}
                        value={subCatSelectedValue(index, value)}
                        onChange={(selectedOption) => {
                          onChange(selectedOption);
                          handleChange(index, "subCategory", selectedOption);
                        }}
                        isSearchable={true}
                        isDisabled={
                          !dropdownOptions ||
                          !dropdownOptions?.subCategoryList ||
                          dropdownOptions?.subCategoryList?.length === 0 ||
                          (dropdownOptions?.subCategoryList?.length > 0 &&
                            typeof dropdownOptions?.subCategoryList[index] ===
                              "undefined")
                            ? true
                            : false
                        }
                        options={
                          dropdownOptions?.subCategoryList?.length > 0 &&
                          typeof dropdownOptions?.subCategoryList[index] !==
                            "undefined"
                            ? dropdownOptions?.subCategoryList[index]
                            : []
                        }
                        classNames={{
                          menuButton: () =>
                            `select-text rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ${
                              hasError(`timeslots.${index}.subCategory`)
                                ? "ring-red-600"
                                : "ring-gray-300"
                            }`,
                          menu: "absolute z-10 w-full shadow-lg border rounded py-1 text-sm text-gray-900 dark:text-gray-200 dark:bg-slate-800",
                          list: "opt-div dark:bg-slate-800",
                          listItem: ({ isSelected }: any) =>
                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
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
                  {errors?.timeslots &&
                    errors?.timeslots[index]?.subCategory && (
                      <span className="inline-flex text-sm text-red-700">
                        {errors?.timeslots[index]?.subCategory?.message}
                      </span>
                    )}
                </div>
                <div className="w-full md:w-2/12 flex justify-center items-center">
                  <span>
                    {formValues.timeslots &&
                      formValues.timeslots.length > 0 &&
                      calculateTimeDifference(
                        formValues.timeslots[index]?.startTime,
                        formValues.timeslots[index]?.endTime,
                        true
                      )}
                  </span>
                </div>
                <div className="w-full md:w-1/12">
                  <button
                    type="button"
                    // className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded  w-full md:w-auto md:d-flex justify-content-right"
                    className="rounded-md bg-red-500 hover:bg-red-700 px-2.5 py-2 text-sm text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:w-auto md:d-flex justify-content-right"
                    onClick={() => remove(index)}
                    data-testid={`del-btn-${index}`}
                  >
                    <TrashIcon className="h-4 w-4 hidden md:block" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add row, save buttons starts */}
            {timeslotFields && timeslotFields.length > 0 && (
              <div className="w-full md:w-1/2  mt-2 md:mt-0">
                <button
                  type="button"
                  // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded md:w-auto md:d-flex justify-content-right pr-3 disabled:opacity-50"
                  className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right mr-3"
                  onClick={addRow}
                  disabled={
                    !timesheetDate?.startDate ||
                    isErrorCat ||
                    isErrorTimesheetData ||
                    isLoadingCat ||
                    isLoadingTimesheetData
                  }
                >
                  <PlusIcon className="h-4 w-4 hidden md:block" />
                  <span className="font-normal text-sm">Add entry</span>
                </button>
                <button
                  type="submit"
                  disabled={
                    !timesheetDate?.startDate ||
                    formValues.timeslots.length == 0 ||
                    isLoadingSave
                  }
                  // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded md:w-auto md:d-flex justify-content-right ml-8 pr-3 disabled:opacity-50"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right"
                >
                  {/* <DocumentCheckIcon className="h-4 w-4 hidden md:block" /> */}
                  <span className="font-normal text-sm">Save</span>
                </button>
              </div>
            )}
            {/* Add row, save buttons ends */}
          </div>
          {/* Col 2: Summary generated based on inputs */}
          <div className="w-full md:w-2/12 summary-container mt-5 md:mt-0">
            <div className="ml-summary">
              <TimesheetSummary
                formValues={formValues}
                categoryList={dropdownOptions.categoryList}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const TimesheetForm = memo(TimesheetFormComponent);
