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

  function handleDemo() {
    setError("");
    try {
      authService.startDemoSession();
      navigate("/map", { replace: true });
    } catch (demoError) {
      setError(demoError.message || "Không thể mở chế độ demo.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand"><span>SGT</span><div><strong>SAIGON TRADE</strong><small>B2B Partner Map</small></div></div>
        <h1>Đăng nhập nội bộ</h1>
        <p>Truy cập bản đồ mạng lưới đối tác B2B toàn cầu.</p>
        {env.demoModeEnabled && (
          <div className="dev-notice">Demo chỉ dùng dữ liệu hư cấu để trải nghiệm bản đồ. Đây không phải phiên đăng nhập an toàn và không cấp quyền truy cập dữ liệu thật.</div>
        )}
        <form onSubmit={handleSubmit}>
          <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" required /></label>
          <label>Mật khẩu<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" required /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" disabled={submitting}>{submitting ? "Đang đăng nhập…" : "Đăng nhập"}</button>
        </form>
        {env.demoModeEnabled && (
          <div className="demo-entry">
            <span>hoặc</span>
            <button type="button" className="demo-map-button" onClick={handleDemo}>Xem bản đồ demo</button>
          </div>
        )}
      </section>
    </main>
  );
}
