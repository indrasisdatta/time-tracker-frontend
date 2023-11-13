export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
};

export type LoggedinUser = {
  accessToken: string;
  refreshToken: string;
} | null;

export type ResetPwdFormValues = {
  email?: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
};
