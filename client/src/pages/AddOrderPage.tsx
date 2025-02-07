// src/pages/AddOrderPage.tsx
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, message } from "antd";
import { floorApi, ordersApi } from "../api";
import { useNavigate } from "react-router-dom";
import { Floor, Office } from "../store";

const AddOrderPage: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Получаем список этажей при загрузке страницы
  useEffect(() => {
    (async () => {
      try {
        const response = await floorApi.floorControllerGetFloors();
        // Предполагается, что response.data – массив этажей
        setFloors(response.data ?? []);
      } catch (error) {
        message.error("Ошибка получения этажей");
      }
    })();
  }, []);

  const handleSelectFloor = (floor: Floor) => {
    setSelectedFloor(floor);
  };

  const handleSelectOffice = async (office: Office) => {
    setLoading(true);
    try {
      // Создаём заказ. В теле запроса передаём id выбранного офиса (а также, возможно, id этажа)
      await ordersApi.ordersControllerCreateOrder({
        data: {
          officeId: office.id,
          floorId: office.floorId,
          status: "Готовится",
        },
      });
      message.success(`Заказ для офиса ${office.number} создан`);
      navigate("/orders");
    } catch (error) {
      message.error("Ошибка создания заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {selectedFloor === null ? (
        <>
          <h2>Выберите этаж</h2>
          <Row gutter={[16, 16]}>
            {floors.map((floor) => (
              <Col key={floor.id}>
                <Card hoverable onClick={() => handleSelectFloor(floor)}>
                  {floor.name}
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <>
          <Button
            onClick={() => setSelectedFloor(null)}
            style={{ marginBottom: 16 }}
          >
            Назад к этажам
          </Button>
          <h2>Выберите офис на этаже {selectedFloor.name}</h2>
          <Row gutter={[16, 16]}>
            {selectedFloor.offices.map((office) => (
              <Col key={office.id}>
                <Card hoverable onClick={() => handleSelectOffice(office)}>
                  Офис {office.number}
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default AddOrderPage;
