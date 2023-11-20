import { Loader } from "@/app/common/components/Loader";
import { PrimaryButton } from "@/app/common/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/app/common/components/buttons/Secondarybutton";
import { useFormInitialize } from "@/app/common/hooks/useFormInitialize";
import { ChangePwdValues } from "@/models/User";
import { changePwdSave } from "@/services/UserService";
import { pwdValidate, toastOptions } from "@/utils/helper";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";

const defaultValues: ChangePwdValues = {
  password: "",
  confirmPassword: "",
};

export const ChangePaswordForm = () => {
  const { register, handleSubmit, errors, reset, hasError, watch } =
    useFormInitialize<ChangePwdValues>(defaultValues);

  const changePasswordApi = async (formData: ChangePwdValues) => {
    const { data } = await changePwdSave(formData);
    return data;
  };

  const { mutate, isLoading } = useMutation(changePasswordApi, {
    onSuccess: (userResp) => {
      console.log("Change Password API Success", userResp);
      if (userResp.status == 1) {
        reset(defaultValues);
        toast.success(`Your password is updated successfully.`, toastOptions);
      } else {
        toast.error(userResp?.error || "Something went wrong", toastOptions);
      }
    },
    onError: (error) => {
      console.log("Change Password API Error", error);
      toast.error(
        `Error: ${
          (error as any).response?.data?.error || "Something went wrong."
        }`,
        toastOptions
      );
    },
  });

  const changePwdSubmit = async (formData: ChangePwdValues) => {
    console.log("Change pwd submit", formData);
    mutate(formData);
  };

  /**
   * Get each input's div class based on field and error/valid status
   * @param field string - Form field name
   * @returns string - class name of input
   */
  const getInputClass = (field: string) => {
    let commonClasses = `w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus-within:rounded-md focus-within:ring-1 focus-within:ring-inset focus-visible:outline-none `;
    if (hasError(field)) {
      commonClasses += `focus-within:ring-red-800`;
    } else {
      commonClasses += `focus-within:ring-blue-800 dark:focus-within:ring-blue-400`;
    }
    return commonClasses;
  };

  /**
   * Get each input's parent div class based on field and error/valid status
   * @param field string - Form field name
   * @returns string - class name of input parent div
   */
  const getInputDivClass = (field: string) => {
    let classes = `rounded-md shadow-sm ring-1 ring-inset focus:outline-0 `;
    if (hasError(field)) {
      classes += "ring-red-600";
    } else {
      classes += "ring-gray-300";
    }
    return classes;
  };

  return (
    <div>
      <Toaster />
      {isLoading && <Loader className="m-auto mt-3" />}
      <form onSubmit={handleSubmit(changePwdSubmit)} noValidate>
        <div className="md:flex mb-4">
          <div className="w-full md:w-1/3">
            <label
              htmlFor="name"
              className={`block text-sm font-medium leading-6 ${
                hasError("title")
                  ? "text-red-600"
                  : "text-gray-900 dark:text-gray-200"
              }`}
            >
              Password
            </label>
            <div className="mt-1">
              <div className={getInputDivClass("password")}>
                <input
                  type="password"
                  id="password"
                  className={getInputClass("password")}
                  placeholder="••••••••"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    minLength: {
                      value: Number(process.env.NEXT_PUBLIC_PWD_MIN_CHARS),
                      message: `Password should have minimum ${process.env.NEXT_PUBLIC_PWD_MIN_CHARS} characters`,
                    },
                    validate: pwdValidate,
                  })}
                />
              </div>
              {errors?.password && (
                <span className="inline-flex text-sm text-red-700">
                  {errors?.password?.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="md:flex mb-4">
          <div className="w-full md:w-1/3">
            <label
              htmlFor="name"
              className={`block text-sm font-medium leading-6 ${
                hasError("title")
                  ? "text-red-600"
                  : "text-gray-900 dark:text-gray-200"
              }`}
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <div className={getInputDivClass("confirmPassword")}>
                <input
                  type="password"
                  id="confirmPassword"
                  className={getInputClass("confirmPassword")}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "Confirm Password is required",
                    },
                    validate: (val: string) => {
                      if (watch("password") !== val) {
                        return "Password and Confirm password fields should match";
                      }
                    },
                  })}
                />
              </div>
              {errors?.confirmPassword && (
                <span className="inline-flex text-sm text-red-700">
                  {errors?.confirmPassword?.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="">
          <PrimaryButton
            disabled={isLoading}
            text="Submit"
            type="submit"
            className="mr-2"
            onClick={() => {}}
          />
          <SecondaryButton
            disabled={isLoading}
            text="Cancel"
            type="form_cancel"
            onClick={() => reset(defaultValues)}
          />
        </div>
      </form>
    </div>
  );
};
