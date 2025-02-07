import { create } from "zustand";
import { persist } from "zustand/middleware";

// src/store.ts
export interface AuthState {
  token: string | null;
  userId?: number;
  mustChangePassword: boolean;
  setToken: (token: string | null) => void;
  setMustChangePassword: (flag: boolean) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      userId: undefined,
      mustChangePassword: false,
      setToken: (token: string | null) => set({ token }),
      setUserId: (userId: number) => set({ userId }),
      setMustChangePassword: (flag: boolean) =>
        set({ mustChangePassword: flag }),
    }),
    { name: "auth" }
  )
);

export interface Order {
  id: string;
  office: Office;
  floor: Floor;
  status: "PREPARING" | "READY" | "CLOSED";
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

export interface OrdersState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  updateOrder: (updatedOrder: Order) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  setOrders: (orders: Order[]) => set({ orders }),
  updateOrder: (updatedOrder: Order) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      ),
    })),
}));
