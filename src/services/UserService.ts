import { LoginFormValues, SignupFormValues } from "@/models/User";
import { axios } from "./axios";

export const userLogin = async (payload: LoginFormValues) => {
  return await axios.post("/user/login", payload);
};

export const userSignup = async (payload: SignupFormValues) => {
  return await axios.post("/user/signup", payload);
};

export const forgotPwdRequest = async (payload: { email: string }) => {
  return await axios.post("/user/forgot-password", payload);
};

export const checkResetToken = async (resetToken: string) => {
  return await axios.get(`/user/reset-password/${resetToken}`);
};
