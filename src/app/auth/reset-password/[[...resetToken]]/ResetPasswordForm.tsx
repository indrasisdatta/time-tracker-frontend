"use client";
import { Loader } from "@/app/common/components/Loader";
import { useFormInitialize } from "@/app/common/hooks/useFormInitialize";
import { ResetPwdFormValues } from "@/models/User";
import { checkResetToken, resetPwdSave } from "@/services/UserService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

const defaultValues: ResetPwdFormValues = {
  email: "",
  resetToken: "",
  password: "",
  confirmPassword: "",
};
const toastOptions = {
  duration: 5000,
  style: {
    maxWidth: "30em",
  },
};

export const ResetPasswordForm = ({ resetToken }: { resetToken: string }) => {
  const router = useRouter();

  const fetchTokenUser = async () => {
    const { data } = await checkResetToken(
      resetToken && resetToken.length > 0 ? resetToken[0] : ""
    );
    return data;
  };

  const {
    isLoading,
    data: tokenData,
    error: tokenError,
  } = useQuery(["resetPwd", resetToken], fetchTokenUser);

  const {
    register,
    handleSubmit,
    errors,
    reset,
    hasError,
    getInputClass,
    watch,
  } = useFormInitialize<ResetPwdFormValues>(defaultValues);

  const resetPwdApi = async (formData: ResetPwdFormValues) => {
    const { data } = await resetPwdSave(formData);
    return data;
  };

  const { isLoading: isLoadingSave, mutate } = useMutation(resetPwdApi, {
    onSuccess: (userResp) => {
      console.log("Reset pwd API Success", userResp);
      if (userResp.status == 1) {
        reset(defaultValues);
        toast.success(`Password reset successfully`, toastOptions);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      } else {
        toast.error(userResp?.error || "Something went wrong", toastOptions);
      }
    },
    onError: (error) => {
      console.log("Login API Error", error);
      toast.error(
        `Error: ${
          (error as any).response?.data?.error || "Something went wrong."
        }`,
        toastOptions
      );
    },
  });

  const resetFormSubmit = (formData: ResetPwdFormValues) => {
    console.log("Reset submit", formData);
    mutate(formData);
  };

  /* If token is valid, update React form with email and token */
  useEffect(() => {
    if (tokenData?.data?.token) {
      reset({
        email: tokenData?.data?.user?.email,
        resetToken: tokenData?.data?.token,
      });
    }
  }, [tokenData?.data?.token]);

  console.log("Token data", tokenData);

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <Toaster />
      {(isLoadingSave || isLoading) && <Loader className="m-auto mt-3 flex" />}

      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold ">Reset your password</h1>
        {tokenData && tokenData?.status == 1 && (
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(resetFormSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium leading-6 ${
                  hasError("email")
                    ? "text-red-600"
                    : "text-gray-900 dark:text-gray-200"
                }`}
              >
                Your email
              </label>
              <input
                type="email"
                className={getInputClass("email")}
                placeholder="name@company.com"
                readOnly={true}
                {...register("email")}
              />
              {errors?.email && (
                <span className="inline-flex text-sm text-red-700">
                  {errors?.email?.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium leading-6 ${
                  hasError("password")
                    ? "text-red-600"
                    : "text-gray-900 dark:text-gray-200"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={getInputClass("password")}
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Password should have at least 6 characters",
                  },
                  validate: (val: string) => {
                    // at least 1 lower-case
                    const lowerCase = /[ -~]*[a-z][ -~]*/;
                    // at least 1 upper-case
                    const upperCase = /[ -~]*[A-Z][ -~]*/;
                    // at least 1 special character
                    const splCase = /[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/;
                    // at least 1 number
                    const numCase = /[ -~]*[0-9][ -~]*/;
                    if (
                      !lowerCase.test(val) ||
                      !upperCase.test(val) ||
                      !splCase.test(val) ||
                      !numCase.test(val)
                    ) {
                      return "Password should have at least 1 lower case, 1 upper case and 1 special character";
                    }
                  },
                })}
              />
              {errors?.password && (
                <span className="inline-flex text-sm text-red-700">
                  {errors?.password?.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className={`block text-sm font-medium leading-6 ${
                  hasError("confirmPassword")
                    ? "text-red-600"
                    : "text-gray-900 dark:text-gray-200"
                }`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={getInputClass("confirmPassword")}
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
              {errors?.confirmPassword && (
                <span className="inline-flex text-sm text-red-700">
                  {errors?.confirmPassword?.message}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right mr-3"
              >
                Submit
              </button>
            </div>

            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
        {!tokenData ||
          (tokenData?.status == 0 && (
            <p>{tokenData?.error ?? "Reset token is invalid."}</p>
          ))}
        {tokenError && (tokenError as any)?.response?.data?.error && (
          <p>{(tokenError as any)?.response?.data?.error}</p>
        )}
      </div>
    </div>
  );
};
