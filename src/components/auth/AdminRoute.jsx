import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../contexts/authentication";

function AdminRoute() {
  const { state } = useAuth();

  if (state.user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
