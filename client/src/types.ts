// src/types.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  forceChangePassword: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Типы для заказов, этажей и офисов можно взять из store.ts или расширить их здесь
export interface Order {
  id: string;
  office: Office;
  floor: Floor;
  status: "Готовится" | "Готов";
  createdAt: string;
}

export interface Floor {
  id: string;
  name: string;
  offices: Office[];
}

export interface Office {
  id: string;
  number: string;
  floorId: string;
}
