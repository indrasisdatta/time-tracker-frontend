import React from "react";

export const PrimaryButton = ({
  text,
  type,
  className,
  onClick,
}: {
  text: string;
  type: any;
  className?: string;
  onClick: any;
}) => {
  return (
    <button
      type={type}
      className={`rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 md:w-auto md:d-flex justify-content-right ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
