import { api } from "./api";

export const isAuthenticated = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data.user;
  } catch (e) {
    return false;
  }
};
