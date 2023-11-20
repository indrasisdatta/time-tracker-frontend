import { getLoggedinUserData } from "@/utils/auth";
import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/* Inject access token in Authorization header */
axios.interceptors.request.use(async (config) => {
  const loggedinData = await getLoggedinUserData();
  if (
    typeof loggedinData === "object" &&
    loggedinData &&
    loggedinData.hasOwnProperty("accessToken")
  ) {
    config.headers.Authorization = `Bearer ${loggedinData.accessToken}`;
  }
  return config;
});

export { axios };
