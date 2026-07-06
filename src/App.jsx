import LandingPage from "./pages/LandingPage"
import ArticleDetail from "./pages/ArticleDetail"
import NotFoundPage from "./pages/NotFoundPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/posts/:id" element={<ArticleDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" closeButton />
    </>
  )
}

export default App
