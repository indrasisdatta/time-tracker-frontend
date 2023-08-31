"use client";

import Link from "next/link";
import "../../globals.css";
import { ThemeSwitch } from "./ThemeSwitch";
import { useState } from "react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b-[1px] border-gray-300">
      <nav className="flex items-center justify-between flex-wrap py-3 px-8">
        <div className="flex items-center flex-shrink-0  text-indigo-700 dark:text-teal-100 dark:hover:text-white mr-6 lg:mr-72">
          <Link href="/">Timesheet App</Link>
        </div>
        {/* Mobile display */}
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
          >
            <svg
              className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
            <svg
              className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>
        <div
          className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="text-sm lg:flex-grow">
            <Link
              href="/category"
              className="block mt-2 text-lg md:text-sm md:mt-4 lg:inline-block lg:mt-0 text-indigo-700 dark:text-teal-100 dark:hover:text-white mr-4"
            >
              Category
            </Link>
            <Link
              href="/calendar"
              className="block mt-2 text-lg md:text-sm md:mt-4 lg:inline-block lg:mt-0 text-indigo-700 dark:text-teal-100 dark:hover:text-white mr-4"
            >
              Calendar
            </Link>
          </div>
          <div className="mt-3 md:mt-0 text-center lg:inline-flex items-center">
            <ThemeSwitch />
          </div>
        </div>
      </nav>
    </header>
  );
};
