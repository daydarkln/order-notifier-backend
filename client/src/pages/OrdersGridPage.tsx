import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, message, FloatButton, Tag } from "antd";
import { ordersApi } from "../api";
import { useNavigate } from "react-router-dom";
import { Order } from "../store";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

// Подключите плагины
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PREPARING":
      return "blue";
    case "READY":
      return "green";
    case "CLOSED":
      return "gray";
    default:
      return "default";
  }
};

export const statusText = {
  PREPARING: "Готовится",
  READY: "Готов",
  CLOSED: "Закрыт",
};

export const getTimeElapsed = (createdAt: string) => {
  const now = dayjs();
  const created = dayjs(createdAt);
  const duration = dayjs.duration(now.diff(created));

  const minutes = duration.minutes();

  return `${minutes} мин`;
};

const OrdersGridPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(dayjs()); // Состояние для текущего времени
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.ordersControllerGetOrders();
      setOrders(response.data);
    } catch (error) {
      messageApi.error("Ошибка получения заказов");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Таймер для обновления текущего времени каждые 10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs()); // Обновляем текущее время
    }, 1000); // 10 секунд

    return () => clearInterval(interval); // Очистка таймера при размонтировании компонента
  }, []);

  const handleMarkReady = async (order: Order) => {
    try {
      messageApi.open({
        content: (
          <span>
            <LoadingOutlined /> Подождите
          </span>
        ),
        key: "loading",
      });
      if (order.status === "READY") {
        await ordersApi.ordersControllerMarkOrderClosed(order.id);
        messageApi.success("Заказ закрыт и тут больше не отобразится");
        messageApi.destroy("loading");
      }
      if (order.status === "PREPARING") {
        await ordersApi.ordersControllerMarkOrderReady(order.id);
        messageApi.success('Заказ помечен как "Готов"');
        messageApi.destroy("loading");
      }

      fetchOrders();
    } catch (error) {
      message.error("Ошибка обновления заказа");
      messageApi.destroy("loading");
    }
  };

  return (
    <div style={{ padding: 16, position: "relative" }}>
      {contextHolder}
      <Row gutter={[16, 16]}>
        {orders
          .filter((o) => o.status !== "CLOSED")
          .map((order) => (
            <Col key={order.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                onClick={() => handleMarkReady(order)}
                style={{ width: "100%" }}
              >
                <span>ID: {order.id}</span>
                <h3 style={{ marginTop: 0 }}>Офис {order.office.number}</h3>
                <p>
                  Статус:{" "}
                  <Tag color={getStatusColor(order.status)}>
                    {statusText[order.status]}
                  </Tag>
                </p>
                {order.status === "PREPARING" ? (
                  <p>Создан: {getTimeElapsed(order.createdAt)} назад</p>
                ) : null}
              </Card>
            </Col>
          ))}
      </Row>
      {/* Плавающая кнопка для добавления заказа */}
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        style={{ width: 50, height: 50 }}
        onClick={() => navigate("/orders/add")}
      />
    </div>
  );
};

export default OrdersGridPage;
