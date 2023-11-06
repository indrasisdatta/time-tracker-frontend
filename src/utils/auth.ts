"use server";
import { LoggedinUser } from "@/models/User";
import { isServer } from "@/utils/helper";
import { cookies } from "next/headers";

/* Local storage key to store logged in user data */
const USER_LS_KEY = "userData";

// export const LoggedinUserData = {
//   set: (userObj: LoggedinUser) => {
//     if (!isServer() && !!userObj) {
//       return localStorage.setItem(USER_LS_KEY, JSON.stringify(userObj));
//     }
//   },
//   get: () => {
//     if (!isServer() && !!localStorage.getItem(USER_LS_KEY)) {
//       return JSON.parse(localStorage.getItem(USER_LS_KEY) as string);
//     }
//     return null;
//   },
//   clear: () => {
//     if (!isServer()) {
//       localStorage.removeItem(USER_LS_KEY);
//     }
//   },
// };

export const setLoggedinUserData = async (userObj: LoggedinUser) => {
  return cookies().set(USER_LS_KEY, JSON.stringify(userObj));
};

export const getLoggedinUserData = async () => {
  console.log(`Reading cookie ${USER_LS_KEY}`, cookies().get(USER_LS_KEY));
  if (cookies().has(USER_LS_KEY)) {
    return JSON.parse(cookies().get(USER_LS_KEY)!.value);
  }
  return null;
};
export const deleteLoggedinUserData = async () => {
  // return cookies().delete(USER_LS_KEY);
  return cookies().set({
    name: USER_LS_KEY,
    value: "",
    expires: new Date("2016-10-05"),
    path: "/", // For all paths
  });
};
