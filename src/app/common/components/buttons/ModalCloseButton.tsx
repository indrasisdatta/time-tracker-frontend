import React from "react";

export const ModalCloseButton = ({ clickHandler }: { clickHandler: any }) => {
  return (
    <button
      className="p-1 ml-auto bg-transparent border-0 text-black dark:text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
      onClick={clickHandler}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 -mt-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default ModalCloseButton;
