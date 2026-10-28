import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { env } from "../../../config/env.js";
import { authService } from "../services/authService.js";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authService.login(form);
      navigate(location.state?.from || "/map", { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.message || loginError.message || "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand"><span>SGT</span><div><strong>SAIGON TRADE</strong><small>B2B Partner Map</small></div></div>
        <h1>Đăng nhập nội bộ</h1>
        <p>Truy cập bản đồ mạng lưới đối tác B2B toàn cầu.</p>
        {env.mockAuthEnabled && (
          <div className="dev-notice">Development mock: nhập email và mật khẩu bất kỳ. Đây không phải cơ chế bảo mật thật.</div>
        )}
        <form onSubmit={handleSubmit}>
          <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" required /></label>
          <label>Mật khẩu<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" required /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" disabled={submitting}>{submitting ? "Đang đăng nhập…" : "Đăng nhập"}</button>
        </form>
      </section>
    </main>
  );
}
