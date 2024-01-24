import { AuthContext } from "@/context/AuthContext";
import { LoggedinUser } from "@/models/User";
import { useContext, useEffect, useState } from "react";

export const useAuth = () => {
  const [userData, setUserData] = useState<LoggedinUser>(null);
  const { loggedinUser, setLoggedinUser } = useContext(AuthContext);

  console.log("useAuth loggedinUser", loggedinUser);

  useEffect(() => {
    (async () => {
      let log = await loggedinUser;
      console.log("useAuth change detected - loggedinUser", log);
      setUserData(log);
    })();
  }, [loggedinUser]);

  return {
    loggedinUser: userData,
    setLoggedinUser,
  };
};
