"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ResetPasswordForm } from "./ResetPasswordForm";

const ResetPassword = ({ params }: { params: { resetToken: string } }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  });
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
      <QueryClientProvider client={queryClient}>
        <ResetPasswordForm resetToken={params?.resetToken} />
      </QueryClientProvider>
    </div>
  );
};

export default ResetPassword;
