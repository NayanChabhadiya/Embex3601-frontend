import apiClient from "../../../services/api/apiClient";
import API_ENDPOINTS from "../../../services/api/endpoints";

const warehouseService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.WAREHOUSES.BASE, {
      params,
    });

    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.WAREHOUSES.BY_ID(id));

    return response.data;
  },

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.WAREHOUSES.BASE,
      payload,
    );

    return response.data;
  },

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.WAREHOUSES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.WAREHOUSES.BY_ID(id));

    return response.data;
  },
};

export default warehouseService;
