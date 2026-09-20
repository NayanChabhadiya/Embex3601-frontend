import apiClient from "../../../services/api/apiClient";
import API_ENDPOINTS from "../../../services/api/endpoints";

const userService = {
  create: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, payload);

    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE);

    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));

    return response.data;
  },

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.USERS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));

    return response.data;
  },
};

export default userService;
