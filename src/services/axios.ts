import { getLoggedinUserData, setLoggedinUserData } from "@/utils/auth";
import Axios from "axios";
import { authRegenerateToken } from "./UserService";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/* Inject access token in Authorization header */
axios.interceptors.request.use(async (config) => {
  console.log("Request interceptor config", config, config.url);
  const loggedinData = await getLoggedinUserData();
  let tokenField = "accessToken";
  let headerKey = "x-access-token";
  if (config.url?.includes("/user/regenerate-token")) {
    tokenField = "refreshToken";
    headerKey = "x-refresh-token";
  }
  if (
    typeof loggedinData === "object" &&
    loggedinData &&
    loggedinData.hasOwnProperty(tokenField)
  ) {
    console.log(`Inject Authorization ${tokenField}`);
    config.headers.Authorization = `${headerKey} ${loggedinData[tokenField]}`;
  }
  return config;
});

axios.interceptors.response.use(
  (successResponse) => successResponse,
  async (error) => {
    console.log("Interceptor response error:", error);
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const tokenResponse = await authRegenerateToken();
      console.log("Token response", tokenResponse);
      if (tokenResponse?.data?.accessToken) {
        setLoggedinUserData(tokenResponse?.data);
        axios.defaults.headers.common[
          "Authorization"
        ] = `x-access-token ${tokenResponse?.data?.accessToken}`;
        return axios(originalRequest);
      }
    }
    console.log("Not 401", error.response.status, originalRequest?._retry);
    return Promise.reject(error);
  }
);

export { axios };
