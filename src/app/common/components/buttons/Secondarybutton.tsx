import React from "react";

export const SecondaryButton = ({
  disabled,
  text,
  type,
  onClick,
}: {
  disabled: boolean;
  text: string;
  type: "button" | "reset" | "submit" | "form_cancel" | undefined;
  onClick: any;
}) => {
  if (type == "form_cancel") {
    return (
      <button
        type="button"
        disabled={disabled}
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 mr-2 dark:bg-gray-500 dark:text-white dark:border-gray-600 dark:hover:bg-gray-400 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 mr-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
