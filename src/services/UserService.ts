import { LoginFormValues, SignupFormValues } from "@/models/User";
import { axios } from "./axios";

export const userLogin = async (payload: LoginFormValues) => {
  return await axios.post("user/login", payload);
};

export const userSignup = async (payload: SignupFormValues) => {
  return await axios.post("/user/signup", payload);
};