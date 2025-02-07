// src/api.ts
import axios from "axios";
import { AuthApi, FloorsApi, OrdersApi } from "./generated-api/api"; // путь к сгенерированным API-классам

// Настройка базового URL – изменить под ваш сервер
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Функция для получения токена из localStorage
const getToken = () => {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");
  return authData?.state?.token || "";
};

// Интерсептор для добавления токена в заголовки запроса
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор для обработки ошибок
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   // Если статус ответа 401 (Unauthorized), перенаправляем на /login
    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

// Инициализация API-клиентов
export const authApi = new AuthApi(undefined, "", axiosInstance);
export const floorApi = new FloorsApi(undefined, "", axiosInstance);
export const ordersApi = new OrdersApi(undefined, "", axiosInstance);
