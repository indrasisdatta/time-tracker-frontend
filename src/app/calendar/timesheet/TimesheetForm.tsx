"use client";
import React, { memo, useEffect, useReducer, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import { useMutation, useQuery } from "react-query";
import { Category, SubCategory } from "@/models/Category";
import { TimesheetPayload } from "@/models/Timesheet";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { calculateTimeDifference } from "@/utils/helper";
import { Loader } from "@/app/common/components/Loader";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { saveTimesheet } from "@/services/TimesheetService";

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

const TimesheetFormComponent = () => {
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
    // onSuccess: () => {
    //   toast.success("Timesheet saved", {
    //     position: "top-right",
    //   });
    //   redirect("/calendar");
    // },
  });

  /* Based on form submit API response, show error toast or redirect */
  if (isSaveError) {
    toast.error(
      `Error: ${(saveError as any).response?.data?.error.join(", ")}`,
      {
        duration: 5000,
        style: {
          maxWidth: "30em",
        },
      }
    );
  } else if (savedData) {
    setTimeout(() => {
      toast.success("Timesheet saved", {
        position: "top-right",
        // autoClose: 5000,
      });
    }, 1);
    redirect("/calendar");
  }

  /* Reducer to store category and subcategory dropdown values */
  const dropdownOptionsReducer = (
    state: DropdownOptions,
    action: { type: string; payload: any }
  ) => {
    switch (action.type) {
      case "CATEGORY_LOAD":
        return { ...state, categoryList: action.payload };
      // case "SUBCATEGORY_LOAD":
      //   break;
      case "CATEGORY_SELECT":
        console.log("Cat select");
        let subCats: any[] = [];
        let matchingCat = state.categoryList.find(
          (cat: any) => cat.value === action.payload.catId
        );
        if (matchingCat) {
          matchingCat.subCategories?.forEach((subCat: SubCategory) => {
            subCats.push({ value: subCat._id, label: subCat.name });
          });
        }
        const subcatList = structuredClone(state.subCategoryList);
        subcatList[action.payload.index] = subCats;
        return {
          ...state,
          subCategoryList: subcatList,
        };
      // case "SUBCATEGORY_SELECT":
      //   break;
      // case "UPDATE":
      //   break;
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
        // dispatchDropdownOptions({
        //   type: "SUBCATEGORY_SELECT",
        //   payload: { subCatId: selectedOption.value },
        // });
        break;
    }
  };

  /* Date change event handler */
  const handleDateChange = (newValue: DateValueType) => {
    console.log("newValue:", newValue);
    setTimesheetDate(newValue);
  };

  const formValues = getValues();

  console.log("categoryData", categoryData);
  console.log("dropdownOptions", dropdownOptions);
  console.log("Form errors", errors);
  console.log("Form values", formValues);

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
    console.log("Check hasError", field, errors);
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
      {isLoadingSave && <Loader className="m-auto mt-3" />}
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
              <div className="w-full md:w-1/2  mt-2 md:mt-0">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded md:w-auto md:d-flex justify-content-right pr-3 disabled:opacity-50"
                  onClick={addRow}
                  disabled={!timesheetDate?.startDate}
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
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded md:w-auto md:d-flex justify-content-right ml-8 pr-3 disabled:opacity-50"
                >
                  <DocumentCheckIcon className="h-4 w-4 hidden md:block" />
                  <span className="font-normal text-sm ml-1">Save</span>
                </button>
              </div>
            </div>
            {/* Timesheet enry headings */}
            {timeslotFields && timeslotFields.length > 0 && (
              <div className="flex gap-x-12 text-center mb-2">
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
                        options={dropdownOptions?.categoryList}
                        classNames={{
                          menuButton: () =>
                            `select-text rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ${
                              hasError(`timeslots.${index}.category`)
                                ? "ring-red-600"
                                : "ring-gray-300"
                            }`,
                          menu: "absolute z-10 w-full shadow-lg border rounded py-1 text-sm text-gray-900 dark:text-gray-200 dark:bg-dark",
                          list: "opt-div dark:bg-dark",
                          listItem: ({ isSelected }: any) =>
                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                              isSelected
                                ? `text-white bg-blue-500`
                                : `text-gray-900 dark:text-gray-200 
                                hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`
                            }`,
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
                        placeholder="Select sub-category"
                        // value={value as any as SelectValue}
                        value={subCatSelectedValue(index, value)}
                        onChange={(selectedOption) => {
                          onChange(selectedOption);
                          handleChange(index, "subCategory", selectedOption);
                        }}
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
                          menu: "absolute z-10 w-full shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-900 dark:text-gray-200",
                          list: "opt-div",
                          listItem: ({ isSelected }: any) =>
                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                              isSelected
                                ? `text-white bg-blue-500`
                                : `text-gray-900 dark:text-gray-200 
                                hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`
                            }`,
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
                <div className="w-full md:w-1/12 flex justify-center items-center">
                  <span>
                    {calculateTimeDifference(
                      formValues.timeslots[index].startTime,
                      formValues.timeslots[index].endTime,
                      true
                    )}
                  </span>
                </div>
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

export const TimesheetForm = memo(TimesheetFormComponent);
