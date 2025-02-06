// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

const ProtectedRoute: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const mustChangePassword = useAuthStore((state) => state.mustChangePassword);

  // Если пользователь не авторизован, перенаправляем на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Если требуется смена пароля, перенаправляем на соответствующую страницу
  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
