"use client";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import "../calendar.scss";
import { PlusIcon } from "@heroicons/react/20/solid";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import Select from "react-tailwindcss-select";

// type DateField = {
//   startDate: string | null;
//   endDate: string | null;
// };

export const TimesheetForm = () => {
  const [timesheetDate, setTimesheetDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [value, onChange] = useState("10:00");
  const [cat, setCat] = useState(null);

  const handleChange = (value) => {
    console.log("value:", value);
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

  return (
    <div>
      <Toaster />
      {/* {isLoading && <Loader className="m-auto mt-3" />} */}
      <form
        // onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex">
          {/* Col 1: form inputs */}
          <div className="w-full md:w-9/12">
            <div className="md:flex mb-4 ">
              <div className="w-full md:w-1/2 date-container">
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
              </div>
              <div className="w-full md:w-1/2  mt-2 md:mt-0">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded w-full md:w-auto md:d-flex justify-content-right"
                  //onClick={() => append({ name: "", description: "" })}
                  //data-testid={`add-btn-${index}`}
                >
                  <PlusIcon className="h-4 w-4 hidden md:block" />
                  <span className="md:hidden font-normal text-sm">Add row</span>
                </button>
              </div>
            </div>
            {/* Timesheet enry headings */}
            <div className="flex">
              <div className="w-full md:w-1/2">Start time</div>
              <div className="w-full md:w-1/2">End time</div>
              <div className="w-full md:w-1/2">Category</div>
              <div className="w-full md:w-1/2">Sub-category</div>
              <div className="w-full md:w-1/2">Duration</div>
            </div>
            {/* Timesheet enry input rows */}
            <div className="flex">
              <div className="w-full md:w-1/2">
                <TimePicker onChange={onChange} value={value} />
              </div>
              <div className="w-full md:w-1/2">
                <TimePicker onChange={onChange} value={value} />
              </div>
              <div className="w-full md:w-1/2">
                <Select value={cat} onChange={handleChange} options={options} />
              </div>
              <div className="w-full md:w-1/2">
                <Select value={cat} onChange={handleChange} options={options} />
              </div>
              <div className="w-full md:w-1/2">1 hr</div>
            </div>
          </div>
          {/* Col 2: Summary generated based on inputs */}
          <div className="w-full md:w-3/12">Summary</div>
        </div>
      </form>
    </div>
  );
};
