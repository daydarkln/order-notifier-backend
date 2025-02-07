// src/pages/ChangePasswordPage.tsx
import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { ChangePasswordRequest } from "../types";
import { useAuthStore } from "../store";

const ChangePasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setMustChangePassword, userId } = useAuthStore();

  const onFinish = async (values: ChangePasswordRequest) => {
    setLoading(true);
    try {
      await authApi.authControllerChangePassword({
        data: { ...values, userId },
      });
      message.success("Пароль успешно изменён");
      // После смены пароля убираем флаг
      setMustChangePassword(false);
      navigate("/orders");
    } catch (error) {
      message.error("Ошибка смены пароля");
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
      <Card title="Смена пароля">
        <Form name="changePassword" onFinish={onFinish}>
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: "Введите старый пароль" }]}
          >
            <Input.Password placeholder="Старый пароль" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: "Введите новый пароль" }]}
          >
            <Input.Password placeholder="Новый пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Изменить пароль
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
