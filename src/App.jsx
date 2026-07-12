import LandingPage from "./pages/LandingPage"
import ArticleDetail from "./pages/ArticleDetail"
import NotFoundPage from "./pages/NotFoundPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProfilePage from "./pages/ProfilePage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import AdminArticlePage from "./pages/admin/AdminArticlePage"
import AdminArticleFormPage from "./pages/admin/AdminArticleFormPage"
import AdminCategoryPage from "./pages/admin/AdminCategoryPage"
import AdminCategoryFormPage from "./pages/admin/AdminCategoryFormPage"
import AdminProfilePage from "./pages/admin/AdminProfilePage"
import AdminNotificationPage from "./pages/admin/AdminNotificationPage"
import AdminResetPasswordPage from "./pages/admin/AdminResetPasswordPage"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* หน้าสาธารณะ */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/posts/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

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
      </BrowserRouter>
      <Toaster position="bottom-right" closeButton />
    </>
  )
}

export default App
