import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import MapPage from "../features/map/pages/MapPage.jsx";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/map" element={<MapPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/map" replace />} />
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
