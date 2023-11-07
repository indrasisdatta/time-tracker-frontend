"use client";
import { LoggedinUser } from "@/models/User";
import { getLoggedinUserData } from "@/utils/auth";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  createContext,
} from "react";

/**
 * TODO: loggedinUser should use Cookie data
 * !Check promise type, sot hat function returns user cookie data correctly
 */

export const AuthContext = createContext<{
  loggedinUser: Promise<LoggedinUser>;
  setLoggedinUser: Dispatch<SetStateAction<Promise<LoggedinUser>>>;
}>({
  loggedinUser: getLoggedinUserData() || null,
  setLoggedinUser: () => Promise.resolve(null),
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // LoggedinUser
  const [loggedinUser, setLoggedinUser] = useState(async () => {
    const loggedin = await getLoggedinUserData();
    // console.log("Get loggedin cookie", loggedin);
    return loggedin || null;
  });

  console.log("Context loggedinUser", loggedinUser);

  return (
    <AuthContext.Provider value={{ loggedinUser, setLoggedinUser }}>
      {children}
    </AuthContext.Provider>
  );
};
