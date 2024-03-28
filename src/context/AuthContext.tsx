"use client";
import { LoggedinUser } from "@/models/User";
import { getLoggedinUserData } from "@/utils/auth";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  createContext,
  useEffect,
} from "react";

export const AuthContext = createContext<{
  loggedinUser: LoggedinUser | null;
  setLoggedinUser: Dispatch<SetStateAction<LoggedinUser | null>>;
}>({
  // loggedinUser: getLoggedinUserData() || null,
  loggedinUser: null,
  // setLoggedinUser: () => Promise.resolve(null),
  setLoggedinUser: () => null,
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // LoggedinUser
  // const [loggedinUser, setLoggedinUser] = useState(async () => {
  //   const loggedin = await getLoggedinUserData();
  //   return loggedin || null;
  // });

  const [loggedinUser, setLoggedinUser] = useState<LoggedinUser | null>(null);

  useEffect(() => {
    (async () => {
      const loggedin = await getLoggedinUserData();
      setLoggedinUser(loggedin);
    })();
  }, []);

  console.log("Context loggedinUser", loggedinUser);

  return (
    <AuthContext.Provider value={{ loggedinUser, setLoggedinUser }}>
      {children}
    </AuthContext.Provider>
  );
};
