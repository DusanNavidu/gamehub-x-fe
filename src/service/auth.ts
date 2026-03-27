import api from "./api";

export const requestOTP = async (email: string) => {
  // Backend endpoint eka: /auth/login-request
  const res = await api.post("/auth/login-request", { email });
  return res.data;
};

export const verifyOTPCode = async (email: string, otp: string) => {
  // Backend endpoint eka: /auth/login-verify
  const res = await api.post("/auth/login-verify", { email, otp });
  return res.data; // Meke thama accessToken, refreshToken enne
};

export const refreshTokens = async (token: string) => {
  // Backend endpoint eka: /auth/refresh
  const res = await api.post("/auth/refresh", { token });
  return res.data; 
};

export const register = async (fullName: string, email: string) => {
  const res = await api.post("/auth/register", { fullName, email });
  return res.data;
};

export const getMyDetails = async () => {
  const res = await api.get("/auth/me");
  return res.data; // Response: { message: "ok", data: { id, email, fullName } }
};