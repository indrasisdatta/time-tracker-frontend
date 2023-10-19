import React from "react";

export const AltButton = ({
  text,
  type,
  className,
  onClick,
}: {
  text: string;
  type: string;
  className?: string;
  onClick: any;
}) => {
  return (
    <button
      type="button"
      className={`text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 mr-2 dark:bg-gray-200 dark:border-gray-600 dark:hover:bg-white dark:hover:border-gray-600 dark:focus:ring-gray-700 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
