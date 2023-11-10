import React, {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { SecondaryButton } from "./buttons/Secondarybutton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { ModalCloseButton } from "./buttons/ModalCloseButton";
import { useFormInitialize } from "../hooks/useFormInitialize";
import { emailValidateRegex } from "@/utils/helper";
import { useMutation } from "react-query";
import toast from "react-hot-toast";

const toastOptions = {
  duration: 5000,
  style: {
    maxWidth: "30em",
  },
};

const ForgotPassword = ({
  title,
  email,
  showForgotPwdPopup,
  setShowForgotPwdPopup,
  onCloseModal,
}: {
  title: string;
  email: string;
  showForgotPwdPopup: boolean;
  setShowForgotPwdPopup: Dispatch<SetStateAction<boolean>>;
  onCloseModal: Function;
}) => {
  const { register, handleSubmit, errors, reset, hasError } =
    useFormInitialize<{ email: string }>({ email: "" });

  /**
   * Get each input's div class based on field and error/valid status
   * @param field string - Form field name
   * @returns string - class name of input
   */
  const getInputClassCustom = (field: string) => {
    let commonClasses = `border sm:text-sm rounded-lg block w-full p-2.5  dark:placeholder-gray-400  `;
    // focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500
    if (hasError(field)) {
      commonClasses += `text-gray-900 dark:text-gray-700 bg-red-50 dark:bg-red-300 border-red-800 dark:border-red-600 focus:ring-red-800 focus:border-red-800`;
    } else {
      commonClasses += `text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500`;
    }
    return commonClasses;
  };

  const forgotPwdRequestApi = async (formData: {
    email: string;
  }): Promise<any> => {
    console.log("Forgot pwd api call...");
    const { data } = await forgotPwdRequestApi(formData);
    return data;
  };

  const { mutate: forgotPwdMutate, isLoading } = useMutation(
    forgotPwdRequestApi,
    {
      onSuccess: (userResp: { status: number; data: any; error: any }) => {
        if (userResp.status == 1) {
          reset({ email: "" });
          toast.success(
            "Password reset email has been sent to your email address",
            toastOptions
          );
          setShowForgotPwdPopup(false);
        } else {
          toast.error(userResp?.error || "Something went wrong", toastOptions);
        }
      },
      onError: (error) => {
        console.log("Forgot pwd API Error", error);
        toast.error(
          `Error: ${
            (error as any).response?.data?.error || "Something went wrong."
          }`,
          toastOptions
        );
      },
    }
  );

  const forgotPwdSubmit = (formData: { email: string }) => {
    console.log("Forgot pwd submit", formData);
    forgotPwdMutate(formData);
  };

  useEffect(() => {
    reset({
      email,
    });
  }, [email]);

  return (
    <>
      {showForgotPwdPopup ? (
        <>
          <form onSubmit={handleSubmit(forgotPwdSubmit)}>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative my-6 mx-auto w-96">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-700 outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between pt-3 pb-1 px-3 border-b border-solid border-slate-200 rounded-t">
                    <h4 className="text-xl font-semibold">{title}</h4>
                    <ModalCloseButton clickHandler={onCloseModal} />
                  </div>
                  {/*body*/}
                  <div className="relative p-3 flex-auto">
                    <p className="mb-3">
                      A password reset link will be sent to your registered
                      email address.
                    </p>
                    <input
                      className={getInputClassCustom("email")}
                      placeholder="name@company.com"
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Email is required",
                        },
                        pattern: {
                          value: emailValidateRegex,
                          message: "Email is invalid",
                        },
                      })}
                    />
                    {errors?.email && (
                      <span className="inline-flex text-sm text-red-500">
                        {errors?.email?.message}
                      </span>
                    )}
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end py-3 px-1 border-t border-solid border-slate-200 rounded-b">
                    <PrimaryButton
                      disabled={isLoading}
                      className="mr-3"
                      type="submit"
                      text="Submit"
                      onClick={() => {
                        console.log("Open report");
                      }}
                    />
                    <SecondaryButton
                      type="button"
                      text="Close"
                      onClick={onCloseModal}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export const ForgotPasswordPopup = memo(ForgotPassword);
