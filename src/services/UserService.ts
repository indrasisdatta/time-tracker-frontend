import {
  ChangePwdValues,
  LoginFormValues,
  ResetPwdFormValues,
  SignupFormValues,
  UserProfileValues,
} from "@/models/User";
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

export const resetPwdSave = async (payload: ResetPwdFormValues) => {
  if (payload.hasOwnProperty("email")) {
    delete payload.email;
  }
  return await axios.post(`/user/reset-password`, payload);
};

export const changePwdSave = async (payload: ChangePwdValues) => {
  return await axios.post(`/user/change-password`, payload);
};

export const getUserProfile = async () => {
  return await axios.get(`/user/profile`);
};

export const editProfileSave = async (payload: UserProfileValues) => {
  const formData = new FormData();
  for (let key in payload) {
    formData.append(key, (payload as any)[key]);
  }
  return await axios.post(`/user/edit-profile`, formData);
};
