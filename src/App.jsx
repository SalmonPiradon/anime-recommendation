import LandingPage from "./pages/LandingPage"
import ArticleDetail from "./pages/ArticleDetail"
import NotFoundPage from "./pages/NotFoundPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProfilePage from "./pages/ProfilePage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/posts/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" closeButton />
    </>
  )
}

export default App
