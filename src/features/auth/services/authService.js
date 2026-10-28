import apiClient from "../../../config/apiClient.js";
import { env } from "../../../config/env.js";

const DEMO_SESSION_KEY = "sgt_demo_session";
const ACCESS_TOKEN_KEY = "sgt_access_token";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export const authService = {
  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) throw new Error("Vui lòng nhập email và mật khẩu.");
    if (!env.apiBaseUrl) throw new Error("Backend API chưa được cấu hình cho môi trường này.");

    const { data } = await apiClient.post("/auth/login", { email: normalizedEmail, password });
    if (!data.accessToken) throw new Error("Phản hồi đăng nhập không chứa access token hợp lệ.");
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    return data.user;
  },

  startDemoSession() {
    if (!env.demoModeEnabled) throw new Error("Chế độ demo chưa được bật.");
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.setItem(DEMO_SESSION_KEY, "active");
  },

  isDemoSession() {
    return env.demoModeEnabled && sessionStorage.getItem(DEMO_SESSION_KEY) === "active";
  },

  logout() {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  hasSession() {
    return this.isDemoSession() || Boolean(sessionStorage.getItem(ACCESS_TOKEN_KEY));
  },
};
