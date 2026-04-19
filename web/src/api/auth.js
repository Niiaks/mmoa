import api from "./client";

export const register = async (userData) => {
  const { data } = await api.post("/api/v1/auth/register", userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post("/api/v1/auth/login", credentials);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/api/v1/auth/me");
  return data.user;
};
