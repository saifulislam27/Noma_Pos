import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Sesuaikan dengan URL backend NOMA POS kamu
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 INI KUNCINYA: Gunakan Interceptor untuk menyisipkan token secara dinamis sebelum request dikirim
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;