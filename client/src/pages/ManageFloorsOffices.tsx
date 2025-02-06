import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, message, Card, List, Modal } from "antd";
import { floorApi } from "../api";
import Title from "antd/es/typography/Title";

const { Option } = Select;

const AddFloorOffice: React.FC = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [editingOffice, setEditingOffice] = useState(null);

  const fetchFloors = async () => {
    try {
      const response = await floorApi.floorControllerGetFloors();
      setFloors(response.data);
    } catch (error) {
      message.error("Не удалось загрузить этажи");
    }
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  const handleAddFloor = async (values: { name: string }) => {
    setLoading(true);
    try {
      await floorApi.floorControllerCreateFloor({ ...values });
      message.success("Этаж успешно добавлен");
      fetchFloors();
    } catch (error) {
      message.error("Ошибка при добавлении этажа");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffice = async (values: {
    floorId: number;
    number: string;
  }) => {
    setLoading(true);
    try {
      debugger;
      await floorApi.floorControllerCreateOffice({ ...values });
      message.success("Офис успешно добавлен");
      fetchFloors();
    } catch (error) {
      message.error("Ошибка при добавлении офиса");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFloor = async (id: number) => {
    setLoading(true);
    try {
      await floorApi.floorControllerDeleteFloor(id);
      message.success("Этаж успешно удален");
      fetchFloors();
    } catch (error) {
      message.error("Ошибка при удалении этажа");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffice = async (id: number) => {
    setLoading(true);
    try {
      await floorApi.floorControllerDeleteOffice(id);
      message.success("Офис успешно удален");
      fetchFloors();
    } catch (error) {
      message.error("Ошибка при удалении офиса");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFloor = (floor: any) => {
    setEditingFloor(floor);
    setIsEditModalVisible(true);
  };

  const handleEditOffice = (office: any) => {
    setEditingOffice(office);
    setIsEditModalVisible(true);
  };

  const handleUpdateFloor = async (values: { name: string }) => {
    setLoading(true);
    try {
      await floorApi.floorControllerUpdateFloor(editingFloor.id, {
        data: values,
      });
      message.success("Этаж успешно обновлен");
      setIsEditModalVisible(false);
      fetchFloors();
    } catch (error) {
      message.error("Ошибка при обновлении этажа");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOffice = async (values: { number: string }) => {
    setLoading(true);
    try {
      await floorApi.floorControllerUpdateOffice(editingOffice.id, {
        data: values,
      });
      message.success("Офис успешно обновлен");
      setIsEditModalVisible(false);
      fetchFloors();
    } catch (error) {
      message.error("Ошибка при обновлении офиса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, display: "flex", gap: 20 }}>
      <div style={{ flexGrow: 1 }}>
        <Card title="Добавление этажа" style={{ marginBottom: 20 }}>
          <Form layout="inline" onFinish={handleAddFloor}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Введите название этажа" }]}
            >
              <Input placeholder="Название этажа" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Добавить этаж
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title="Добавление офиса">
          <Form layout="inline" onFinish={handleAddOffice}>
            <Form.Item
              name="floorId"
              rules={[{ required: true, message: "Выберите этаж" }]}
            >
              <Select placeholder="Выберите этаж" style={{ width: 200 }}>
                {floors.map((floor: any) => (
                  <Option key={floor.id} value={floor.id}>
                    {floor.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="number"
              rules={[{ required: true, message: "Введите номер офиса" }]}
            >
              <Input placeholder="Номер офиса" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Добавить офис
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div style={{ flexGrow: 1 }}>
        <Title>Этажи</Title>
        {floors.map((f) => (
          <Card
            title={f.name}
            key={f.id}
            extra={
              <>
                <Button type="link" onClick={() => handleEditFloor(f)}>
                  Редактировать
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteFloor(f.id)}
                >
                  Удалить
                </Button>
              </>
            }
          >
            Всего офисов: {f.offices.length}
            <List
              size="small"
              bordered
              dataSource={f.offices}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => handleEditOffice(item)}>
                      Редактировать
                    </Button>,
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteOffice(item.id)}
                    >
                      Удалить
                    </Button>,
                  ]}
                >
                  {item.number}
                </List.Item>
              )}
            />
          </Card>
        ))}
      </div>

      <Modal
        title={editingFloor ? "Редактирование этажа" : "Редактирование офиса"}
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        {editingFloor && (
          <Form
            initialValues={{ name: editingFloor.name }}
            onFinish={handleUpdateFloor}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Введите название этажа" }]}
            >
              <Input placeholder="Название этажа" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Обновить этаж
              </Button>
            </Form.Item>
          </Form>
        )}
        {editingOffice && (
          <Form
            initialValues={{ number: editingOffice.number }}
            onFinish={handleUpdateOffice}
          >
            <Form.Item
              name="number"
              rules={[{ required: true, message: "Введите номер офиса" }]}
            >
              <Input placeholder="Номер офиса" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Обновить офис
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AddFloorOffice;
