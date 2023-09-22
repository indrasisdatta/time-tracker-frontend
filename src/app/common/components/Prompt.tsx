import { Category } from "@/models/Category";
import React, { useState } from "react";
import { SecondaryButton } from "./buttons/Secondarybutton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import ModalCloseButton from "./buttons/ModalCloseButton";

const Prompt = ({
  title,
  message,
  // category,
  showModal,
  setShowModal,
  onSubmitModal,
  onCloseModal,
}: {
  title: string;
  message: string | null;
  // category: Category | null;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitModal: any;
  onCloseModal: any;
}) => {
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-700 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between pt-3 pb-1 px-3 border-b border-solid border-slate-200 rounded-t">
                  <h4 className="text-xl font-semibold">{title}</h4>
                  <ModalCloseButton clickHandler={() => setShowModal(false)} />
                </div>
                {/*body*/}
                {message && (
                  <div className="relative p-3 flex-auto">
                    <p className="text-slate-500 dark:text-white leading-relaxed">
                      {message}
                    </p>
                  </div>
                )}
                {/*footer*/}
                <div className="flex items-center justify-end py-3 px-1 border-t border-solid border-slate-200 rounded-b">
                  <SecondaryButton
                    type="button"
                    text="Cancel"
                    onClick={onCloseModal}
                  />
                  <PrimaryButton
                    type="button"
                    text="Delete"
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

export default Prompt;
