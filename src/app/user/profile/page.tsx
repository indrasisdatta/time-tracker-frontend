"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChangePaswordForm } from "./ChangePaswordForm";
import { EditProfileForm } from "./EditProfileForm";

const queryClient = new QueryClient();

const UserProfile = () => {
  const [openTab, setOpenTab] = useState(1);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <ul className="flex flex-wrap -mb-px">
          <li>
            <a
              href="#"
              onClick={() => setOpenTab(1)}
              className={`${
                openTab === 1
                  ? "border-blue-600 border-b-2 "
                  : "border-transparent"
              } inline-block py-4 pr-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 active dark:text-blue-500 dark:border-blue-500 group`}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => setOpenTab(2)}
              className={`${
                openTab === 2
                  ? "border-blue-600 border-b-2"
                  : "border-transparent"
              } inline-block p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 dark:border-blue-500 group`}
            >
              Change Password
            </a>
          </li>
        </ul>
        <div className="mt-6">
          <div className={openTab === 1 ? "block" : "hidden"}>
            {" "}
            <EditProfileForm />
          </div>
          <div className={openTab === 2 ? "block" : "hidden"}>
            <ChangePaswordForm />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default UserProfile;
