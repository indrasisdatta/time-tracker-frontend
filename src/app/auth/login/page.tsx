"use client";
import React from "react";
import { LoginForm } from "./LoginForm";
import { QueryClient, QueryClientProvider } from "react-query";

const Login = () => {
  const queryClient = new QueryClient();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    </div>
  );
};

export default Login;
