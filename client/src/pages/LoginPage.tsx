// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "../store";
import { LoginRequest, LoginResponse } from "../types";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setUserId, setToken, setMustChangePassword } = useAuthStore();

  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      // Вызов API для логина
      const response = await authApi.authControllerLogin({
        data: values,
      });
      // Предполагается, что response.data содержит { token, mustChangePassword }
      const data: LoginResponse = response.data as unknown as LoginResponse;
      setToken(data.access_token);
      setUserId(data.userId);
      setMustChangePassword(data.forceChangePassword);
      // Если требуется смена пароля – переходим на ChangePasswordPage
      if (data.forceChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/orders");
      }
    } catch (error) {
      message.error("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card title="Вход">
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input placeholder="Логин" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
