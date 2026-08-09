import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    getUserLoading: null,   // loading state for fetching user data ถูกนำไปใช้ใน App.jsx
    error: null,          
    user: null,
  });

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ดึงข้อมูล user จาก backend ด้วย token ใน localStorage
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      // Authorization header ถูกแนบโดย jwtInterceptor อัตโนมัติ
      const response = await axios.get(`${API_BASE_URL}/auth/get-user`);
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
    } catch (error) {
      // 401: jwtInterceptor ลบ token + redirect แล้ว
      // อัปเดต state ให้ UI สอดคล้อง (กรณี error อื่นที่ไม่ใช่ 401)
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data) => {
    const result = await axios.post(`${API_BASE_URL}/auth/login`, data);
    const token = result.data.access_token;
    localStorage.setItem("token", token);
    await fetchUser();
    navigate("/");
  };

  const signup = async (data) => {
    // ไม่ navigate ที่นี่ — ให้ SignupPage แสดงหน้า success เอง
    await axios.post(`${API_BASE_URL}/auth/register`, data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState((prevState) => ({
      ...prevState,
      user: null,
      error: null,
    }));
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{ state, login, logout, signup, isAuthenticated, fetchUser }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
