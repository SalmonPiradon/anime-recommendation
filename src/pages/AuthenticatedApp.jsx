import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./LandingPage";
import ArticleDetail from "./ArticleDetail";
import NotFoundPage from "./NotFoundPage";
import ProfilePage from "./ProfilePage";
import ResetPasswordPage from "./ResetPasswordPage";
import AdminArticlePage from "./admin/AdminArticlePage";
import AdminArticleFormPage from "./admin/AdminArticleFormPage";
import AdminCategoryPage from "./admin/AdminCategoryPage";
import AdminCategoryFormPage from "./admin/AdminCategoryFormPage";
import AdminProfilePage from "./admin/AdminProfilePage";
import AdminNotificationPage from "./admin/AdminNotificationPage";
import AdminResetPasswordPage from "./admin/AdminResetPasswordPage";
import AdminRoute from "../components/auth/AdminRoute";

function AuthenticatedApp() {
  return (
    <Routes>
      {/* หน้าสาธารณะ — คน login แล้วยังเข้าดูได้ */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/posts/:id" element={<ArticleDetail />} />

      {/* หน้าสมาชิก */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* หน้า admin — เฉพาะ role admin (เช็กครั้งเดียวที่ parent) */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="articles" replace />} />
        <Route path="articles" element={<AdminArticlePage />} />
        <Route path="articles/create" element={<AdminArticleFormPage />} />
        <Route path="articles/edit/:id" element={<AdminArticleFormPage />} />
        <Route path="categories" element={<AdminCategoryPage />} />
        <Route path="categories/create" element={<AdminCategoryFormPage />} />
        <Route path="categories/edit/:id" element={<AdminCategoryFormPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="notifications" element={<AdminNotificationPage />} />
        <Route path="reset-password" element={<AdminResetPasswordPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AuthenticatedApp;
