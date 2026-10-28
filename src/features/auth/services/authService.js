import apiClient from "../../../config/apiClient.js";
import { env } from "../../../config/env.js";

const SESSION_KEY = "sgt_mock_session";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export const authService = {
  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) throw new Error("Vui lòng nhập email và mật khẩu.");

    if (env.mockAuthEnabled) {
      const session = { email: normalizedEmail, displayName: "Development User", mock: true };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }

    const { data } = await apiClient.post("/auth/login", { email: normalizedEmail, password });
    if (data.accessToken) sessionStorage.setItem("sgt_access_token", data.accessToken);
    return data.user;
  },

  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("sgt_access_token");
  },

  hasSession() {
    if (env.mockAuthEnabled) return Boolean(sessionStorage.getItem(SESSION_KEY));
    return Boolean(sessionStorage.getItem("sgt_access_token"));
  },
};
