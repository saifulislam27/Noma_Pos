import api from "./api"; // Pastikan menggunakan instance api Axios kamu

// LOGIN
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// REGISTER CASHIER
export const register = async (data) => {
  const response = await api.post("/auth/register-cashier", data);
  return response.data;
};

// 🌟 TAMBAHKAN FUNGSI INI (Jangan lupa kata 'export' di depannya)
export const getCashiers = async () => {
  const response = await api.get("/auth/cashiers");
  return response.data;
};