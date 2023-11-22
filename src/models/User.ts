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

export type UserInfo = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  profileImage: string;
};

export type LoggedinUser = {
  accessToken: string;
  refreshToken: string;
  userInfo: UserInfo;
} | null;

export type ResetPwdFormValues = {
  email?: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
};

export type ChangePwdValues = {
  password: string;
  confirmPassword: string;
};

export type UserProfileValues = {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: any;
};
