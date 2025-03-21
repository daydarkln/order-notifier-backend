// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AddOrderPage from "./pages/AddOrderPage";
import OrdersGridPage from "./pages/OrdersGridPage";
import WaitScreenPage from "./pages/WaitScreenPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddFloorOffice from "./pages/ManageFloorsOffices";
import { useAuthStore } from "./store";
import { ConfigProvider } from "antd";

const App: React.FC = () => {
  console.log(import.meta.env.VITE_ORIGIN);
  const { token } = useAuthStore();
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#252525" } }}>
      <Router>
        <Routes>
          {/* Страница логина */}
          <Route path="/login" element={<LoginPage />} />
          {/* Страница смены пароля */}
          <Route path="/change-password" element={<ChangePasswordPage />} />
          {/* Защищённые маршруты */}
          <Route element={<ProtectedRoute />}>
            <Route path="/orders/add" element={<AddOrderPage />} />
            <Route path="/orders" element={<OrdersGridPage />} />
          </Route>
          {/* Экран ожидания можно оставить открытым */}
          <Route path="/wait" element={<WaitScreenPage />} />
          <Route path="/admin/floors" element={<AddFloorOffice />} />
          {/* Редирект по умолчанию */}
          <Route
            path="*"
            element={<Navigate to={token ? "/orders" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
