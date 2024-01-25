import {
  deleteLoggedinUserData,
  getLoggedinUserData,
  setLoggedinUserData,
} from "@/utils/auth";
import Axios from "axios";
import { authRegenerateToken } from "./UserService";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const healthCheck = async () => {
  return await axios.get(`health`);
};

/* Request interceptor - Inject access token in Authorization header */
axios.interceptors.request.use(async (config) => {
  console.log("Request interceptor config", config, config.url);
  /* Header injection is not needed for health endpoint */
  if (config.url === "health") {
    return config;
  }
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

/* Response interceptor */
axios.interceptors.response.use(
  (successResponse) => successResponse,
  async (error) => {
    console.log("Interceptor response error:", error);
    const originalRequest = error.config;
    /* Access token expired, so regenerate access and refresh tokens */
    if (error.response.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const { data: tokenResponse } = await authRegenerateToken();
      console.log("Token response", tokenResponse);
      if (tokenResponse?.data?.accessToken) {
        const savedUserData = await getLoggedinUserData();
        console.log("Saved logged in data: ", savedUserData);
        console.log("User data to save: ", {
          ...savedUserData,
          ...tokenResponse?.data,
        });
        setLoggedinUserData({ ...savedUserData, ...tokenResponse?.data });
        axios.defaults.headers.common[
          "Authorization"
        ] = `x-access-token ${tokenResponse?.data?.accessToken}`;
        console.log("401 retry request: ", originalRequest);
        return axios(originalRequest);
      }
    }
    console.log(
      "Not 401 retry",
      error.response.status,
      originalRequest?._retry
    );
    /* Refresh token expired, reset cookies and redirect to login URL */
    if (error.response.status === 403) {
      await deleteLoggedinUserData();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export { axios };
