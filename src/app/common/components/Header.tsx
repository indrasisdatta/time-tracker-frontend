"use client";

import Link from "next/link";
import "../../globals.css";
import { ThemeSwitch } from "./ThemeSwitch";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowDownIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalMenu, setShowCalMenu] = useState(false);

  /* Ref for calendar dropdown element */
  const calDropdown = useRef<HTMLInputElement>(null);

  const pathName = usePathname();

  /* Add, remove event listener for calendar dropdown display */
  useEffect(() => {
    function handleClick(event: any) {
      // console.log("Dropdown ref", calDropdown.current);
      // console.log("Target", event.target);
      if (
        calDropdown.current &&
        (!calDropdown.current.contains(event.target) ||
          (typeof event.target?.className === "string" &&
            event.target?.className?.includes("submenu-link")))
      ) {
        setShowCalMenu(false);
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClick);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("click", handleClick);
      }
    };
  }, [calDropdown]);

  const activeLinkClass = (url: string) => {
    return pathName.includes(url)
      ? "active text-indigo-600 dark:text-white font-bold"
      : "text-indigo-700 dark:text-teal-100 dark:hover:text-white";
  };

  return (
    <>
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
                className={`fill-current h-3 w-3 ${
                  isOpen ? "hidden" : "block"
                }`}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
              <svg
                className={`fill-current h-3 w-3 ${
                  isOpen ? "block" : "hidden"
                }`}
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
                className={`block mt-2 text-lg md:text-sm md:mt-4 lg:inline-block lg:mt-0 mr-4 ${activeLinkClass(
                  "/category"
                )}`}
              >
                Category
              </Link>
              <div className="md:inline" ref={calDropdown}>
                <Link
                  // href="/calendar"
                  href=""
                  id="dropdownCalButton"
                  onClick={() => setShowCalMenu((prevState) => !prevState)}
                  className={`block mt-2 text-lg md:text-sm md:mt-4 lg:inline-block lg:mt-0 mr-4 ${activeLinkClass(
                    "/calendar"
                  )}`}
                >
                  Calendar
                  <ChevronDownIcon className="h-4 w-4" />
                </Link>
                <div
                  id="dropdownCal"
                  className={`${
                    showCalMenu ? "block" : "hidden"
                  } z-10 top-9 md:absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownInformdropdownCalButtonationButton"
                  >
                    <li>
                      <Link
                        href="/calendar"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white submenu-link"
                      >
                        View Calendar
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/calendar/timesheet"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white submenu-link"
                      >
                        Timesheet entry
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-3 md:mt-0 text-center lg:inline-flex items-center">
              <ThemeSwitch />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
