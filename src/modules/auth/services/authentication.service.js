import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const authenticationService = Object.freeze({
  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  login: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);

    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Refresh Access Token
  // ---------------------------------------------------------------------------

  refresh: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, payload);

    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  logout: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, payload);

    return response.data;
  },
});

export default authenticationService;
