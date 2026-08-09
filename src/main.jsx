import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authentication";
import jwtInterceptor from "./utils/jwtInterceptor.js";

jwtInterceptor();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter ครอบ AuthProvider เพราะ AuthProvider ใช้ useNavigate */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
