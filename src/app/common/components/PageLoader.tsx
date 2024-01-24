import React from "react";
import { Loader } from "./Loader";

export const PageLoader = () => {
  return (
    <div className="m-auto text-center">
      <Loader className="" />
      <p className="my-6">Loading page... please wait...</p>
    </div>
  );
};
