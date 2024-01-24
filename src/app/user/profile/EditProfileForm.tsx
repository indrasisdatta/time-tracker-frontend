import { Loader } from "@/app/common/components/Loader";
import { AlertButton } from "@/app/common/components/buttons/AlertButton";
import { PrimaryButton } from "@/app/common/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/app/common/components/buttons/Secondarybutton";
import { useFormInitialize } from "@/app/common/hooks/useFormInitialize";
import { AuthContext } from "@/context/AuthContext";
import { UserProfileValues } from "@/models/User";
import { editProfileSave, getUserProfile } from "@/services/UserService";
import { setLoggedinUserData } from "@/utils/auth";
import { emailValidateRegex, toastOptions } from "@/utils/helper";
import Image from "next/image";
import React, {
  ChangeEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

const defaultValues: UserProfileValues = {
  firstName: "",
  lastName: "",
  email: "",
  profileImage: null,
};

export const EditProfileForm = () => {
  const useAuth: any = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    errors,
    reset,
    hasError,
    watch,
    setValue,
    trigger,
  } = useFormInitialize<UserProfileValues>(defaultValues);

  const profileImageRef = useRef<HTMLInputElement>(null);

  /* Get user profile info */
  const getUserProfileApi = async () => {
    const { data } = await getUserProfile();
    return data;
  };

  const {
    isLoading: isLoadingProfile,
    data: userProfile,
    error: userProfileError,
  } = useQuery("userProfile", getUserProfileApi);

  const updateProfileApi = async (formData: UserProfileValues) => {
    const { data } = await editProfileSave(formData);
    return data;
  };

  useEffect(() => {
    if (userProfile?.status == 1) {
      reset({
        firstName: userProfile?.data?.firstName,
        lastName: userProfile?.data?.lastName,
        email: userProfile?.data?.email,
      });
    }
  }, [userProfile?.status]);

  /* Mutation to save edited profile data */
  const { mutate, isLoading } = useMutation(updateProfileApi, {
    onSuccess: async (userResp) => {
      console.log("Update Profile API Success", userResp);
      if (userResp.status === 1) {
        // reset(defaultValues);
        const userCookieData = await useAuth.loggedinUser;
        console.log("Existing userCookieData", userCookieData);
        if (userCookieData) {
          userCookieData.userInfo = { ...userResp.data };
          console.log("Updated userCookieData", userCookieData);
          setLoggedinUserData(userCookieData);
          useAuth.setLoggedinUser(Promise.resolve(userCookieData));
        }
        handleImageReset();
        userProfile.data = { ...userProfile.data, ...userResp.data };
        toast.success(`Your profile is updated successfully.`, toastOptions);
      } else {
        toast.error(userResp?.error || "Something went wrong", toastOptions);
      }
    },
    onError: (error) => {
      console.log("Update Profile API Error", error);
      toast.error(
        `Error: ${
          (error as any).response?.data?.error || "Something went wrong."
        }`,
        toastOptions
      );
    },
  });

  const updateProfileSubmit = async (formData: UserProfileValues) => {
    // console.log("Update profile submit", formData);
    mutate(formData);
  };

  /* Image upload handler function */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("Upload image", e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      trigger("profileImage");
    }
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

  console.log("Profile data", userProfile, userProfileError);

  const displayUserProfilePhoto = () => {
    if (isLoadingProfile) {
      return null;
    }
    const watchProfileImg = watch("profileImage");
    if (watchProfileImg && !errors?.profileImage) {
      return (
        <Image
          width="100"
          height="100"
          className="rounded w-36 h-36 mr-3"
          loader={() => URL.createObjectURL(watchProfileImg)}
          src={URL.createObjectURL(watchProfileImg)}
          alt=" "
        />
      );
    }
    /* Show previously saved image */
    if (userProfile?.data?.profileImage) {
      return (
        <Image
          width="100"
          height="100"
          className="rounded w-36 h-36 mr-3"
          loader={() => userProfile?.data?.profileImage}
          src={userProfile?.data?.profileImage}
          alt=" "
        />
      );
    }
    /* No image present - show placeholder image */
    return (
      <div className=" bg-gray-100 dark:bg-gray-600">
        <svg
          className="w-36 h-36 text-gray-400 "
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
    );
  };

  const handleImageReset = () => {
    console.log("profileImageRef", profileImageRef);
    if (profileImageRef?.current) {
      setValue("profileImage", "");
      trigger("profileImage");
      profileImageRef.current.value = "";
      profileImageRef.current.type = "";
      profileImageRef.current.type = "file";
    }
  };

  return (
    <div>
      <Toaster />
      {(isLoading || isLoadingProfile) && <Loader className="m-auto mt-3" />}
      <form onSubmit={handleSubmit(updateProfileSubmit)} noValidate>
        <div className="md:flex">
          <div className="w-full md:w-1/2">
            <div className="md:flex mb-4">
              <div className="w-full md:w-2/3">
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
                <div className="mt-1">
                  <div className={getInputDivClass("firstName")}>
                    <input
                      type="text"
                      id="firstName"
                      className={getInputClass("firstName")}
                      placeholder="First Name"
                      {...register("firstName", {
                        required: {
                          value: true,
                          message: "First Name is required",
                        },
                      })}
                    />
                  </div>
                  {errors?.firstName && (
                    <span className="inline-flex text-sm text-red-700">
                      {errors?.firstName?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="md:flex mb-4">
              <div className="w-full md:w-2/3">
                <label
                  htmlFor="lastName"
                  className={`block text-sm font-medium leading-6 ${
                    hasError("lastName")
                      ? "text-red-600"
                      : "text-gray-900 dark:text-gray-200"
                  }`}
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <div className={getInputDivClass("lastName")}>
                    <input
                      type="text"
                      id="lastName"
                      className={getInputClass("lastName")}
                      placeholder="Last Name"
                      {...register("lastName", {
                        required: {
                          value: true,
                          message: "Last Name is required",
                        },
                      })}
                    />
                  </div>
                  {errors?.lastName && (
                    <span className="inline-flex text-sm text-red-700">
                      {errors?.lastName?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="md:flex mb-4">
              <div className="w-full md:w-2/3">
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium leading-6 ${
                    hasError("email")
                      ? "text-red-600"
                      : "text-gray-900 dark:text-gray-200"
                  }`}
                >
                  Email
                </label>
                <div className="mt-1">
                  <div className={getInputDivClass("email")}>
                    <input
                      type="text"
                      id="email"
                      className={getInputClass("email")}
                      placeholder="Email"
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
                  </div>
                  {errors?.email && (
                    <span className="inline-flex text-sm text-red-700">
                      {errors?.email?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="md:flex mb-4">
              <div className="w-full">
                <label
                  htmlFor="profile-image"
                  className={`block text-sm font-medium leading-6 ${
                    hasError("profileImage")
                      ? "text-red-600"
                      : "text-gray-900 dark:text-gray-200"
                  }`}
                >
                  Profile Image
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  {displayUserProfilePhoto()}
                  {!watch("profileImage") && (
                    <label
                      htmlFor="profile-image"
                      className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right"
                    >
                      Upload
                    </label>
                  )}

                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    // accept="image/png, image,jpeg"
                    {...register("profileImage", {
                      validate: (file) => {
                        console.log("Files validation >>", file);
                        if (file) {
                          if (file?.size > 5 * 1000 * 1000) {
                            return "File size should be less than 5MB";
                          }
                          const acceptedFormats = ["jpg", "png"];
                          const fileExtension = file?.name
                            .split(".")
                            .pop()
                            .toLowerCase();
                          if (!acceptedFormats.includes(fileExtension)) {
                            return "Only jpg, png image files are allowed.";
                          }
                        }
                      },
                    })}
                    ref={profileImageRef}
                    onChange={handleImageChange}
                  />
                  {errors?.profileImage && (
                    <span className="inline-flex text-sm text-red-700">
                      {(errors?.profileImage as any)?.message}
                    </span>
                  )}
                  {watch("profileImage") && (
                    <AlertButton
                      text="Reset"
                      type="button"
                      onClick={handleImageReset}
                    />
                  )}
                </div>
              </div>
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
