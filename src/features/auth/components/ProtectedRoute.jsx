import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../services/authService.js";

export default function ProtectedRoute() {
  const location = useLocation();
  return authService.hasSession() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
