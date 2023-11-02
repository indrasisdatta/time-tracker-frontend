import { LoggedinUser } from "@/models/User";
import { isServer } from "@/utils/helper";

/* Local storage key to store logged in user data */
const USER_LS_KEY = "userData";

export const LoggedinUserData = {
  set: (userObj: LoggedinUser) => {
    if (!isServer() && !!userObj) {
      return localStorage.setItem(USER_LS_KEY, JSON.stringify(userObj));
    }
  },
  get: () => {
    if (!isServer() && !!localStorage.getItem(USER_LS_KEY)) {
      return JSON.parse(localStorage.getItem(USER_LS_KEY) as string);
    }
    return null;
  },
  clear: () => {
    if (!isServer()) {
      localStorage.removeItem(USER_LS_KEY);
    }
  },
};
