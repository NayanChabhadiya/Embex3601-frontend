import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const numberSeriesService = {
  // ============================================================
  // GET ALL NUMBER SERIES
  // ============================================================

  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.NUMBER_SERIES.BASE, {
      params,
    });

    return response.data;
  },

  // ============================================================
  // GET NUMBER SERIES BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.NUMBER_SERIES.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE NUMBER SERIES
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.NUMBER_SERIES.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE NUMBER SERIES
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.NUMBER_SERIES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE NUMBER SERIES
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.NUMBER_SERIES.BY_ID(id),
    );

    return response.data;
  },
};

export default numberSeriesService;
