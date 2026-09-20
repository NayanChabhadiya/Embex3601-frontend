import apiClient from "../../../services/api/apiClient.js";

import API_ENDPOINTS from "../../../services/api/endpoints.js";

const authenticationService = {
  login: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);

    return response.data;
  },

  logout: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, payload);

    return response.data;
  },
};

export default authenticationService;
