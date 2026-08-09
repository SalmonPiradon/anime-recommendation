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

function AuthenticatedApp() {
  return (
    <Routes>
      {/* หน้าสาธารณะ — คน login แล้วยังเข้าดูได้ */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/posts/:id" element={<ArticleDetail />} />

      {/* หน้าสมาชิก */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* หน้า admin */}
      <Route path="/admin" element={<Navigate to="/admin/articles" replace />} />
      <Route path="/admin/articles" element={<AdminArticlePage />} />
      <Route path="/admin/articles/create" element={<AdminArticleFormPage />} />
      <Route path="/admin/articles/edit/:id" element={<AdminArticleFormPage />} />
      <Route path="/admin/categories" element={<AdminCategoryPage />} />
      <Route path="/admin/categories/create" element={<AdminCategoryFormPage />} />
      <Route path="/admin/categories/edit/:id" element={<AdminCategoryFormPage />} />
      <Route path="/admin/profile" element={<AdminProfilePage />} />
      <Route path="/admin/notifications" element={<AdminNotificationPage />} />
      <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AuthenticatedApp;
