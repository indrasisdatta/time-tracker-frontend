import ModalCloseButton from "@/app/common/components/buttons/ModalCloseButton";
import { PrimaryButton } from "@/app/common/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/app/common/components/buttons/Secondarybutton";
import { ModalValues, TimesheetPayload, Timeslot } from "@/models/Timesheet";
import React, { useState, useReducer, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Datepicker, {
  DateType,
  DateValueType,
} from "react-tailwindcss-datepicker";
import "../../calendar.scss";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import Select from "react-tailwindcss-select";
import { SubCategory } from "@/models/Category";
import { SelectValue } from "react-tailwindcss-select/dist/components/type";
import { calculateTimeDifference } from "@/utils/helper";

import { Timepicker } from "react-timepicker";
import "react-timepicker/timepicker.css";

type DropdownOptions = {
  categoryList: any;
  subCategoryList: any;
};
const defaultDropdownOptions = {
  categoryList: [],
  subCategoryList: [],
};
const PopupForm = ({
  modalValues,
  formValues,
  showModal,
  setShowModal,
  onSubmitModal,
  onCloseModal,
}: {
  modalValues: ModalValues;
  formValues: TimesheetPayload;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitModal: any;
  onCloseModal: any;
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

  const { index, prevEndTime } = modalValues;
  /* Initialize React hook form */
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<Timeslot>({
    defaultValues: {
      startTime: "",
      endTime: "",
      category: "",
      subCategory: "",
      isProductive: false,
    },
  });

  const hasError = (field: string) => {
    console.log("Check hasError", field, errors);
    // if (field.includes("timeslots")) {
    //   const [fieldName, index, subField] = field.split(".");
    //   if (
    //     errors &&
    //     errors.hasOwnProperty(fieldName) &&
    //     (errors as any)?.[fieldName]?.[index]?.[subField]
    //   ) {
    //     return true;
    //   }
    // }
    return errors && field in errors;
  };

  const onSubmit = (formData: Timeslot) => {
    console.log("Submit form", formData);
  };

  /* Timeslots input change event handler */
  const handleChange = (type: string, selectedOption: any) => {
    console.log("Change handler:", type, selectedOption);
    switch (type) {
      case "category":
        /* Reset the subcategory value when the category changes */
        setValue(`subCategory`, "");
        dispatchDropdownOptions({
          type: "CATEGORY_SELECT",
          payload: { catId: selectedOption.value },
        });
        break;
      case "subCategory":
        setValue(`isProductive`, selectedOption.isProductive);
        break;
    }
  };

  /* Show sub cat selected value only if it's present in dropdown list */
  const subCatSelectedValue = (value: any): SelectValue => {
    if (typeof dropdownOptions?.subCategoryList !== "undefined" && value) {
      const subCatPresent = dropdownOptions?.subCategoryList?.find(
        (subCat: any) => subCat.value === value.value
      );
      return subCatPresent;
    }
    return null;
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <Timepicker />

            <div className="relative my-6 mx-auto w-96">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-700 outline-none focus:outline-none">
                {/*header*/}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="flex items-start justify-between pt-3 pb-1 px-3 border-b border-solid border-slate-200 rounded-t">
                    <h4 className="text-xl font-semibold">Enter Timesheet</h4>
                    <ModalCloseButton
                      clickHandler={() => setShowModal(false)}
                    />
                  </div>
                  {/*body*/}
                  <div className="timeslot-row gap-x-2 mb-3">
                    {/* Start time */}
                    <div className="w-full ">
                      <Controller
                        control={control}
                        name={`startTime`}
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
                            let currStartTime = getValues(`startTime`);
                            let currEndTime = getValues(`endTime`);
                            if (
                              !!currStartTime &&
                              !!currEndTime &&
                              currStartTime > currEndTime
                            ) {
                              validateObj.value = false;
                              validateObj.message =
                                "Start time cannot be greater than end time";
                            }
                            if (index && index > 0) {
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
                              hasError(`startTime`)
                                ? "ring-red-600"
                                : "ring-gray-300"
                            }`}
                            format="HH:mm"
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              handleChange("startTime", value);
                            }}
                            // value={field.startTime}
                          />
                        )}
                      />
                      {errors && errors?.startTime && (
                        <span className="inline-flex text-sm text-red-700">
                          {errors?.startTime?.message}
                        </span>
                      )}
                    </div>
                    {/* End time */}
                    <div className="w-full">
                      <Controller
                        control={control}
                        name={`endTime`}
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
                              hasError(`endTime`)
                                ? "ring-red-600"
                                : "ring-gray-300"
                            }`}
                            format="HH:mm"
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              handleChange("endTime", value);
                            }}
                          />
                        )}
                      />
                      {errors && errors?.endTime && (
                        <span className="inline-flex text-sm text-red-700">
                          {errors?.endTime?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full ">
                      <Controller
                        control={control}
                        name={`category`}
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
                              handleChange("category", selectedOption);
                            }}
                            isSearchable={true}
                            options={dropdownOptions?.categoryList}
                            classNames={{
                              menuButton: () =>
                                `select-text rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ${
                                  hasError(`category`)
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
                      {errors && errors?.category && (
                        <span className="inline-flex text-sm text-red-700">
                          {errors?.category?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <Controller
                        control={control}
                        name={`subCategory`}
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
                            value={subCatSelectedValue(value)}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              handleChange("subCategory", selectedOption);
                            }}
                            isSearchable={true}
                            isDisabled={
                              !dropdownOptions ||
                              !dropdownOptions?.subCategoryList ||
                              dropdownOptions?.subCategoryList?.length === 0 ||
                              (dropdownOptions?.subCategoryList?.length > 0 &&
                                typeof dropdownOptions?.subCategoryList ===
                                  "undefined")
                                ? true
                                : false
                            }
                            options={
                              dropdownOptions?.subCategoryList?.length > 0 &&
                              typeof dropdownOptions?.subCategoryList !==
                                "undefined"
                                ? dropdownOptions?.subCategoryList
                                : []
                            }
                            classNames={{
                              menuButton: () =>
                                `select-text rounded-md shadow-sm ring-1 ring-inset focus:outline-0 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm ${
                                  hasError(`subCategory`)
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
                      {errors && errors?.subCategory && (
                        <span className="inline-flex text-sm text-red-700">
                          {errors?.subCategory?.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full flex justify-center items-center">
                      <span>
                        {/* {formValues.timeslots &&
                          formValues.timeslots.length > 0 &&
                          calculateTimeDifference(
                            formValues.timeslots[index]?.startTime,
                            formValues.timeslots[index]?.endTime,
                            true
                          )} */}
                      </span>
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end py-3 px-1 border-t border-solid border-slate-200 rounded-b">
                    <SecondaryButton
                      type="button"
                      text="Cancel"
                      onClick={onCloseModal}
                    />
                    <PrimaryButton
                      className="mr-2"
                      type="button"
                      text="Save"
                      onClick={onSubmitModal}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default PopupForm;
