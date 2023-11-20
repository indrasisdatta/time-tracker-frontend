import { DefaultValues, FieldValues, useForm } from "react-hook-form";

export function useFormInitialize<T extends FieldValues>(
  defaultValues: DefaultValues<T>
) {
  /* React hook form initialize */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<T>({
    defaultValues,
  });

  /* Check if field has any error */
  const hasError = (field: string) => {
    return errors && field in errors;
  };

  console.log("Errors: ", errors);

  /**
   * Get each input's div class based on field and error/valid status
   * @param field string - Form field name
   * @returns string - class name of input
   */
  const getInputClass = (field: string) => {
    let commonClasses = `border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5  dark:placeholder-gray-400 dark:text-white  `;
    // focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500
    if (hasError(field)) {
      commonClasses += `bg-red-50 dark:bg-red-300 border-red-800 dark:border-red-600 focus:ring-red-800 focus:border-red-800`;
    } else {
      commonClasses += `bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500`;
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

    switch (field) {
      case "name":
        classes += `flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-sm `;
        break;
      case "subCategories":
        classes = `flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-xs `;
        break;
      case "description":
        classes += `sm:max-w-full focus:ring `;
    }
    if (hasError(field)) {
      classes += "ring-red-600";
    } else {
      classes += "ring-gray-300";
    }
    return classes;
  };

  return {
    register,
    handleSubmit,
    errors,
    reset,
    watch,
    hasError,
    getInputClass,
    getInputDivClass,
    getValues,
  };
}
