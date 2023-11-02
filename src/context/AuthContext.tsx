"use client";
import { LoggedinUser } from "@/models/User";
import { LoggedinUserData } from "@/utils/auth";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  createContext,
} from "react";

export const AuthContext = createContext<{
  loggedinUser: LoggedinUser;
  setLoggedinUser: Dispatch<SetStateAction<LoggedinUser>>;
}>({
  loggedinUser: LoggedinUserData.get() || null,
  setLoggedinUser: () => null,
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loggedinUser, setLoggedinUser] = useState<LoggedinUser>(
    LoggedinUserData.get() || null
  );

  return (
    <AuthContext.Provider value={{ loggedinUser, setLoggedinUser }}>
      {children}
    </AuthContext.Provider>
  );
};
