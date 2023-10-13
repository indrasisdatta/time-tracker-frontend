import ModalCloseButton from "@/app/common/components/buttons/ModalCloseButton";
import { PrimaryButton } from "@/app/common/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/app/common/components/buttons/Secondarybutton";
import { Timeslot } from "@/models/Timesheet";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const PopupForm = ({
  modalValues,
  showModal,
  setShowModal,
  onSubmitModal,
  onCloseModal,
}: {
  modalValues: Timeslot;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitModal: any;
  onCloseModal: any;
}) => {
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

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-96">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-700 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between pt-3 pb-1 px-3 border-b border-solid border-slate-200 rounded-t">
                  <h4 className="text-xl font-semibold">Enter Timesheet</h4>
                  <ModalCloseButton clickHandler={() => setShowModal(false)} />
                </div>
                {/*body*/}

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
