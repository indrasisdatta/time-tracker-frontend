"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SignupForm } from "./SignupForm";

const Signup = () => {
  const queryClient = new QueryClient();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
      <QueryClientProvider client={queryClient}>
        <SignupForm />
      </QueryClientProvider>
    </div>
  );
};

export default Signup;
