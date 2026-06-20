import api from "./api"; // Menggunakan instance Axios dari proyekmu

export const getSalesReport = async (startDate, endDate) => {
  const response = await api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};