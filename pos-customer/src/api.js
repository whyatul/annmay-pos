import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const getCategories = () => api.get("/api/menu/categories");
export const getMenuItems = () => api.get("/api/menu/items");
export const placeOrder = (data) => api.post("/api/order/customer", data);

export default api;
