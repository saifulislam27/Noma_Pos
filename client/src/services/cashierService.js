import api from "./api";

export const getCashiers =
async () => {

  const response =
  await api.get(
    "/cashiers"
  );

  return response.data;
};

export const createCashier =
async (data) => {

  const response =
  await api.post(
    "/cashiers",
    data
  );

  return response.data;
};

export const updateCashier =
async (
  id,
  data
) => {

  const response =
  await api.put(
    `/cashiers/${id}`,
    data
  );

  return response.data;
};

export const deleteCashier = async (id) => {
  return await api.delete(`/cashiers/${id}`);
};

export const resetPassword =
async (id) => {

  const response =
  await api.patch(
    `/cashiers/${id}/reset-password`
  );

  return response.data;
};