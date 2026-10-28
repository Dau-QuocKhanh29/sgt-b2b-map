import { useNavigate } from "react-router-dom";
import { authService } from "../features/auth/services/authService.js";

export default function Header() {
  const navigate = useNavigate();
  const demoSession = authService.isDemoSession();
  function logout() {
    authService.logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="brand-mark">SGT</span>
        <strong>SAIGON TRADE</strong>
        <span className="divider" />
        <span>B2B Map</span>
        <span className="context">Đối tác toàn cầu</span>
      </div>
      <div className="topbar-actions">
        <span className="mock-source-badge">{demoSession ? "Demo • Dữ liệu hư cấu" : "Dữ liệu hệ thống"}</span>
        <button type="button" className="ghost-action" onClick={logout}>{demoSession ? "Thoát demo" : "Đăng xuất"}</button>
      </div>
    </header>
  );
}
