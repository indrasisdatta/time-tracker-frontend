/* eslint-disable react/no-unescaped-entities */
import { ForgotPasswordPopup } from "@/app/common/components/ForgotPasswordPopup";
import { Loader } from "@/app/common/components/Loader";
import { useFormInitialize } from "@/app/common/hooks/useFormInitialize";
import { AuthContext } from "@/context/AuthContext";
import { LoginFormValues } from "@/models/User";
import { userLogin } from "@/services/UserService";
import { setLoggedinUserData } from "@/utils/auth";
import { emailValidateRegex } from "@/utils/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";

const defaultValues = {
  email: "",
  password: "",
};
const toastOptions = {
  duration: 5000,
  style: {
    maxWidth: "30em",
  },
};

export const LoginForm = () => {
  const [showForgotPwdPopup, setShowForgotPwdPopup] = useState<boolean>(false);
  const [forgotPwdEmail, setForgotPwdEmail] = useState<string>("");

  const router = useRouter();
  const useAuth = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    errors,
    reset,
    hasError,
    getInputClass,
    getValues,
  } = useFormInitialize<LoginFormValues>(defaultValues);

  const onCloseModal = useCallback(() => {
    setShowForgotPwdPopup(false);
  }, []);

  const onOpenForgotPwdModal = () => {
    const { email } = getValues();
    setShowForgotPwdPopup(true);
    setForgotPwdEmail(email);
  };

  /* Form submit API call */
  const userLoginAPI = async (formData: LoginFormValues) => {
    const { data } = await userLogin(formData);
    return data;
  };

  const {
    mutate,
    data: loginResponse,
    isLoading,
    isError,
    error,
  } = useMutation(userLoginAPI, {
    onSuccess: (userResp) => {
      console.log("Login API Success", userResp);
      if (userResp.status == 1) {
        reset(defaultValues);
        // toast.success(`You've logged in successfully`, toastOptions);
        setLoggedinUserData(userResp.data);
        useAuth.setLoggedinUser(userResp.data);
        setTimeout(() => {
          router.push("/user/profile");
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

  const loginFormSubmit = (formData: LoginFormValues) => {
    console.log("Login form submit", formData);
    mutate(formData);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <Toaster />
      {isLoading && <Loader className="m-auto mt-3 flex" />}

      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold ">Sign in to your account</h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(loginFormSubmit)}
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
              //   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              })}
            />
            {errors?.password && (
              <span className="inline-flex text-sm text-red-700">
                {errors?.password?.message}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right mr-3"
            >
              Sign in
            </button>
            <Link
              onClick={onOpenForgotPwdModal}
              href="#/"
              className="text-sm text-primary-600 hover:underline dark:text-primary-500"
            >
              Forgot password
            </Link>
          </div>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don't have an account yet?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>

      <ForgotPasswordPopup
        title={"Forgot Password"}
        email={forgotPwdEmail}
        showForgotPwdPopup={showForgotPwdPopup}
        onCloseModal={onCloseModal}
      />
    </div>
  );
};
