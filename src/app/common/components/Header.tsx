"use client";

import Link from "next/link";
import "../../globals.css";
import { ThemeSwitch } from "./ThemeSwitch";
import { useState, useRef, useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { ArrowDownIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { isServer, userInitials } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { deleteLoggedinUserData, getLoggedinUserData } from "@/utils/auth";
import { useAuth } from "../hooks/useAuth";
import { LoggedinUser } from "@/models/User";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalMenu, setShowCalMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  /* Ref for calendar dropdown element */
  const calDropdown = useRef<HTMLInputElement>(null);
  /* Ref for user dropdown element */
  const userDropdown = useRef<HTMLInputElement>(null);

  const pathName = usePathname();

  const { loggedinUser, setLoggedinUser } = useAuth();

  console.log("Header logged in user", loggedinUser);

  const userLogout = () => {
    deleteLoggedinUserData();
    setLoggedinUser(null as unknown as Promise<LoggedinUser>);
    console.log("Calling setLoggedinUser");
    router.push(`/auth/login`);
  };

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
      if (
        userDropdown.current &&
        (!userDropdown.current.contains(event.target) ||
          (typeof event.target?.className === "string" &&
            event.target?.className?.includes("submenu-link")))
      ) {
        setShowUserMenu(false);
      }
    }
    if (!isServer()) {
      window.addEventListener("click", handleClick);
    }
    return () => {
      if (!isServer()) {
        window.removeEventListener("click", handleClick);
      }
    };
  }, [calDropdown]);

  const activeLinkClass = (url: string) => {
    return pathName.includes(url)
      ? "active text-indigo-600 dark:text-white font-bold"
      : "text-indigo-700 dark:text-teal-100 dark:hover:text-white";
  };

  const closeMobileMenu = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  return (
    <>
      <header className="border-b-[1px] border-gray-300">
        <nav className="flex items-center justify-between flex-wrap py-3 px-8">
          <div className="flex items-center flex-shrink-0  text-indigo-700 dark:text-teal-100 dark:hover:text-white mr-6 lg:mr-72">
            <Link href="/" onClick={closeMobileMenu}>
              Timesheet App
            </Link>
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
            className={`w-full block flex-grow lg:flex lg:justify-center lg:items-center lg:w-auto ${
              isOpen ? "block" : "hidden"
            }`}
          >
            {loggedinUser && (
              <div className="text-sm lg:flex lg:flex-grow lg:items-center">
                <Link
                  href="/category"
                  onClick={closeMobileMenu}
                  className={`block mt-2 text-lg md:text-sm md:mt-4 lg:inline-flex lg:mt-0 mr-4 ${activeLinkClass(
                    "/category"
                  )}`}
                >
                  Category
                </Link>
                <div className="md:inline" ref={calDropdown}>
                  <Link
                    href="#/"
                    id="dropdownCalButton"
                    onClick={() => setShowCalMenu((prevState) => !prevState)}
                    className={`block mt-2 text-lg md:text-sm md:mt-4 lg:inline-flex lg:mt-0 mr-4 ${activeLinkClass(
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
                    } z-10 top-9 md:absolute bg-white divide-y divide-gray-100 rounded-lg shadow md:w-auto w-50 mt-2 md:mt-0 dark:bg-gray-700 dark:divide-gray-600`}
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownInformdropdownCalButtonationButton"
                    >
                      <li>
                        <Link
                          href="/calendar"
                          onClick={closeMobileMenu}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white submenu-link"
                        >
                          View Calendar
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/calendar/timesheet"
                          onClick={closeMobileMenu}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white submenu-link"
                        >
                          Timesheet entry
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <Link
                  href="/reports"
                  onClick={closeMobileMenu}
                  className={`block mt-2 text-lg md:text-sm md:mt-4 lg:inline-flex lg:mt-0 mr-4 ${activeLinkClass(
                    "/reports"
                  )}`}
                >
                  Reports
                </Link>
              </div>
            )}

            <div
              className={`text-sm lg:flex lg:flex-grow lg:items-center ${
                loggedinUser ? "text-center md:text-left " : ""
              }`}
            >
              {!loggedinUser && (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className={`block mt-2 text-lg md:text-sm md:mt-4 md:float-right lg:inline-flex lg:mt-0 mr-4 ${activeLinkClass(
                      "/auth/login"
                    )}`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={closeMobileMenu}
                    className={`block mt-2 text-lg md:text-sm md:mt-4 md:float-right lg:inline-flex lg:mt-0 mr-4 ${activeLinkClass(
                      "/auth/signup"
                    )}`}
                  >
                    <PrimaryButton
                      // disabled,
                      text="Get Started"
                      type="button"
                      className=""
                      onClick={() => null}
                    />
                  </Link>
                </>
              )}
              {loggedinUser && (
                <>
                  {/* <img
                    id="avatarButton"
                    type="button"
                    data-dropdown-toggle="userDropdown"
                    data-dropdown-placement="bottom-start"
                    class="w-10 h-10 rounded-full cursor-pointer"
                    src="/docs/images/people/profile-picture-5.jpg"
                    alt="User dropdown"
                  /> */}
                  <div
                    ref={userDropdown}
                    className="cursor-pointer md:float-right md:mr-3 relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
                  >
                    <span
                      className=" font-medium text-gray-600 dark:text-gray-300"
                      onClick={() => setShowUserMenu((prevState) => !prevState)}
                    >
                      {userInitials(loggedinUser?.userInfo)}
                    </span>
                  </div>
                  <div
                    id="userDropdown"
                    className={`${
                      showUserMenu ? "block" : "hidden"
                    } z-10 top-[4em] md:absolute bg-white divide-y divide-gray-100 rounded-lg shadow mt-3 md:mt-0 md:w-auto w-50 dark:bg-gray-700 dark:divide-gray-600`}
                  >
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <div>
                        {loggedinUser?.userInfo?.firstName}{" "}
                        {loggedinUser?.userInfo?.lastName}
                      </div>
                      <div className="font-medium truncate">
                        {loggedinUser?.userInfo?.email}
                      </div>
                    </div>
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="avatarButton"
                    >
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <Link
                          href="/auth/login"
                          onClick={userLogout}
                          className={`block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white`}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                    {/* <div className="py-1">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </a>
                    </div> */}
                  </div>
                </>
              )}
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
