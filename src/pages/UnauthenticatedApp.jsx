import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./LandingPage";
import ArticleDetail from "./ArticleDetail";
import NotFoundPage from "./NotFoundPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

function UnauthenticatedApp() {
  return (
    <Routes>
      {/* หน้าสาธารณะ — ดูได้โดยไม่ต้อง login */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/posts/:id" element={<ArticleDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* หน้าที่ต้อง login → ส่งไปหน้า login */}
      <Route path="/profile" element={<Navigate to="/login" replace />} />
      <Route path="/reset-password" element={<Navigate to="/login" replace />} />
      <Route path="/admin/*" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default UnauthenticatedApp;
