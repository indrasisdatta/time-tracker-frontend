import React from "react";

export const AlertButton = ({
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
      className={`text-white bg-red-500 border border-red-600 focus:outline-none hover:bg-red-600 focus:ring-4 focus:ring-red-700 font-medium rounded-lg text-sm px-3 py-2 mr-2 dark:bg-red-600 dark:border-red-700 dark:hover:bg-red-700 dark:hover:border-red-800 dark:focus:ring-red-700 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
