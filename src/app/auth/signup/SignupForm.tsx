"use client";

import { Loader } from "@/app/common/components/Loader";
import { useFormInitialize } from "@/app/common/hooks/useFormInitialize";
import { SignupFormValues } from "@/models/User";
import { userSignup } from "@/services/UserService";
import { emailValidateRegex, pwdValidate, toastOptions } from "@/utils/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  role: "end_user",
  password: "",
  confirmPassword: "",
};

export const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    errors,
    reset,
    watch,
    hasError,
    getInputClass,
  } = useFormInitialize<SignupFormValues>(defaultValues);

  const signupApi = async (formData: SignupFormValues) => {
    const { data } = await userSignup(formData);
    return data;
  };

  const { mutate, isLoading } = useMutation(signupApi, {
    onSuccess: (userResp) => {
      console.log("Signup API Success", userResp);
      if (userResp.status == 1) {
        reset(defaultValues);
        toast.success(`You've signed up successfully.`, toastOptions);
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

  const submitFormHandler = (formData: SignupFormValues) => {
    console.log("Sign up form submitted -->> ", formData);
    mutate(formData);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <Toaster />
      {isLoading && <Loader className="m-auto mt-3 flex" />}
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold ">Sign up for a new account</h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(submitFormHandler)}
          noValidate
        >
          <div>
            <label
              htmlFor="firstName"
              className={`block text-sm font-medium leading-6 ${
                hasError("firstName")
                  ? "text-red-600"
                  : "text-gray-900 dark:text-gray-200"
              }`}
            >
              First Name
            </label>
            <input
              type="firstName"
              className={getInputClass("firstName")}
              placeholder="John"
              {...register("firstName", {
                required: {
                  value: true,
                  message: "First name is required",
                },
              })}
            />
            {errors?.firstName && (
              <span className="inline-flex text-sm text-red-700">
                {errors?.firstName?.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className={`block text-sm font-medium leading-6 ${
                hasError("lastName")
                  ? "text-red-600"
                  : "text-gray-900 dark:text-gray-200"
              }`}
            >
              Last name
            </label>
            <input
              type="lastName"
              className={getInputClass("lastName")}
              placeholder="Doe"
              {...register("lastName", {
                required: {
                  value: true,
                  message: "Last name is required",
                },
              })}
            />
            {errors?.lastName && (
              <span className="inline-flex text-sm text-red-700">
                {errors?.lastName?.message}
              </span>
            )}
          </div>
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
                  value: Number(process.env.NEXT_PUBLIC_PWD_MIN_CHARS),
                  message: `Password should have minimum ${process.env.NEXT_PUBLIC_PWD_MIN_CHARS} characters`,
                },
                validate: pwdValidate,
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
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right mr-3"
          >
            Sign in
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
