"use client";
import React, { useEffect, useReducer, useState } from "react";
import { Toaster } from "react-hot-toast";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import "../calendar.scss";
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
import { useQuery } from "react-query";
import { Category } from "@/models/Category";
import { TimesheetPayload } from "@/models/Timesheet";
import { Controller, useFieldArray, useForm } from "react-hook-form";

// type DateField = {
//   startDate: string | null;
//   endDate: string | null;
// };

const defaultDropdownOptions = {
  categoryList: [],
  subcategoryList: [],
};
const defaultTimesheetFormData: TimesheetPayload = {
  timesheetDate: "",
  timeslots: [],
};

export const TimesheetForm = () => {
  const [timesheetDate, setTimesheetDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [value, onChange] = useState("10:00");
  const [cat, setCat] = useState(null);

  const [timesheetFormData, setTimesheetFormData] = useState<TimesheetPayload>(
    defaultTimesheetFormData
  );
  /* Reducer to store category and subcategory dropdown values */
  const dropdownOptionsReducer = (state, action) => {
    switch (action.type) {
      case "CATEGORY_LOAD":
        return { ...state, categoryList: action.payload };
        break;
      case "SUBCATEGORY_LOAD":
        break;
      case "CATEGORY_SELECT":
        break;
      case "SUBCATEGORY_SELECT":
        break;
      case "UPDATE":
        break;
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
    isLoading,
    data: categoryData,
    error,
  } = useQuery("categoryList", fetchCategories);

  /* Initialize React hook form */
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TimesheetPayload>();

  /* In built react-hook function to add, remove rows */
  const {
    fields: timeslotFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "timeslots",
  });

  /* Update reducer once category API response is obtained */
  useEffect(() => {
    if (
      categoryData &&
      categoryData?.status == 1 &&
      categoryData?.data?.length > 0
    ) {
      dispatchDropdownOptions({
        type: "CATEGORY_LOAD",
        payload: categoryData.data.map((cat: Category) => ({
          value: cat._id,
          label: cat.name,
        })),
      });
    }
  }, [categoryData]);

  const handleChange = (type, value) => {
    console.log("Change handler:", type, value);

    setCat(value);
  };
  const options = [
    { value: "cat1", label: "Cat1" },
    { value: "cat2", label: "Cat2" },
  ];

  const handleValueChange = (newValue: DateValueType) => {
    console.log("newValue:", newValue);
    setTimesheetDate(newValue);
  };

  console.log("categoryData", categoryData);
  console.log("dropdownOptions", dropdownOptions);

  const addRow = () => {
    append({
      startTime: "",
      endTime: "",
      category: "",
      subCategory: "",
      coments: "",
    });
  };

  const onSubmit = () => {
    console.log("Form submitted");
  };

  return (
    <div>
      <Toaster />
      {/* {isLoading && <Loader className="m-auto mt-3" />} */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex">
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
                    field: { onChange, onBlur, value, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                  }) => (
                    <Datepicker
                      placeholder={"Select date"}
                      asSingle={true}
                      useRange={false}
                      value={timesheetDate}
                      onChange={handleValueChange}
                      maxDate={new Date()}
                      displayFormat={"DD/MM/YYYY"}
                      readOnly={true}
                      //   focus-within:ring-1 focus-within:ring-inset
                      inputClassName="w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md  focus-visible:outline-none"
                      containerClassName={`rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ring-gray-300`}
                      toggleClassName="mr-2 mb-1"
                    />
                  )}
                />
              </div>
              <div className="w-full md:w-1/2  mt-2 md:mt-0">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded md:w-auto md:d-flex justify-content-right pr-3"
                  onClick={addRow}
                >
                  <PlusIcon className="h-4 w-4 hidden md:block" />
                  <span className="font-normal text-sm">Add entry</span>
                </button>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded  md:w-auto md:d-flex justify-content-right ml-8 pr-3"
                >
                  <DocumentCheckIcon className="h-4 w-4 hidden md:block" />
                  <span className="font-normal text-sm ml-1">Save</span>
                </button>
              </div>
            </div>
            {/* Timesheet enry headings */}
            {timeslotFields && timeslotFields.length > 0 && (
              <div className="flex gap-x-12 text-center">
                <div className="w-full md:w-2/12">Start time</div>
                <div className="w-full md:w-2/12">End time</div>
                <div className="w-full md:w-2/12">Category</div>
                <div className="w-full md:w-3/12">Sub-category</div>
                <div className="w-full md:w-2/12">Duration</div>
                <div className="w-full md:w-1/12"></div>
              </div>
            )}
            {/* Timesheet enry input rows */}
            {timeslotFields.map((field, index) => (
              <div key={field.id} className="flex timeslot-row gap-x-2">
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
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <TimePicker
                        onChange={(value) => handleChange("startTime", value)}
                        value={field.startTime}
                      />
                    )}
                  />
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
                        onChange={(value) => handleChange("endTime", value)}
                        value={field.endTime}
                      />
                    )}
                  />
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
                        value={cat}
                        onChange={(value) => handleChange("cat", value)}
                        options={dropdownOptions?.categoryList}
                        classNames={{
                          menuButton: ({ isDisabled }) =>
                            `rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ring-gray-300`,
                        }}
                      />
                    )}
                  />
                </div>
                <div className="w-full md:w-3/12">
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
                        value={cat}
                        onChange={handleChange}
                        options={options}
                        classNames={{
                          menuButton: ({ isDisabled }) =>
                            `rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ring-gray-300`,
                          // `flex text-sm text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none ${
                          //   isDisabled
                          //     ? "bg-gray-200"
                          //     : "bg-white hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                          // }`,
                          // menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                          // listItem: ({ isSelected }) =>
                          //   `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                          //     isSelected
                          //       ? `text-white bg-blue-500`
                          //       : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                          //   }`,
                        }}
                      />
                    )}
                  />
                </div>
                <div className="w-full md:w-1/12">1 hr</div>
                <div className="w-full md:w-1/12">
                  <button
                    type="button"
                    className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded  w-full md:w-auto md:d-flex justify-content-right"
                    onClick={() => remove(index)}
                    data-testid={`del-btn-${index}`}
                  >
                    <TrashIcon className="h-4 w-4 hidden md:block" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Col 2: Summary generated based on inputs */}
          <div className="w-full md:w-2/12">Summary</div>
        </div>
      </form>
    </div>
  );
};
