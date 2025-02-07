// src/pages/WaitScreenPage.tsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag } from "antd";
import { ordersApi } from "../api";
import { message } from "antd";
import { Order } from "../store";
import io from "socket.io-client";
import { getStatusColor, getTimeElapsed, statusText } from "./OrdersGridPage";

const WaitScreenPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Подключение к WebSocket серверу
  useEffect(() => {
    const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);

    // Обработка события обновления заказа
    socket.on("orderUpdated", (_updatedOrder: Order) => {
      // setOrders((prevOrders) =>
      //   prevOrders.map((order) =>
      //     order.id === updatedOrder.id ? updatedOrder : order
      //   )
      // );
      fetchOrders();
    });

    // Обработка события создания нового заказа
    socket.on("orderCreated", (_newOrder: Order) => {
      // setOrders((prevOrders) => [...prevOrders, newOrder]);
      fetchOrders();
    });

    // Отключение от WebSocket при размонтировании компонента
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.ordersControllerGetOrders();
      setOrders(response.data ?? ([] as any));
    } catch (error) {
      message.error("Ошибка получения заказов");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Ожидание</h2>
      <Row gutter={[16, 16]}>
        {orders
          ?.filter((o) => o.status !== "CLOSED")
          ?.map((order) => (
            <Col key={order.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                onClick={() => {
                  if (order.id === selectedOrderId) {
                    setSelectedOrderId(null);
                  } else {
                    setSelectedOrderId(order.id);
                  }
                }}
                style={{
                  width: "100%",
                  backgroundColor:
                    selectedOrderId === order.id ? "#bae7ff" : undefined,
                  opacity:
                    selectedOrderId && selectedOrderId !== order.id ? 0.5 : 1,
                }}
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
    </div>
  );
};

export default WaitScreenPage;
