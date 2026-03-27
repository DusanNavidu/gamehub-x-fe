import api from "./api";

export const requestOTP = async (email: string) => {
  const res = await api.post("/auth/request-otp", { email });
  return res.data;
};

export const verifyOTPCode = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh-token", { refreshToken });
  return res.data?.data; 
};

export const register = async (fullName: string, email: string) => {
  const res = await api.post("/auth/register", { fullName, email });
  return res.data;
};