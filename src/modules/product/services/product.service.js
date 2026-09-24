import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const { PRODUCTS } = API_ENDPOINTS;

export const createProduct = async (data) => {
  const response = await apiClient.post(PRODUCTS.BASE, data);

  return response.data;
};

export const getProducts = async () => {
  const response = await apiClient.get(PRODUCTS.BASE);
  console.log(response);

  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(PRODUCTS.BY_ID(id));

  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await apiClient.put(PRODUCTS.BY_ID(id), data);

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(PRODUCTS.BY_ID(id));

  return response.data;
};
