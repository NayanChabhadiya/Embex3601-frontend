import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const taxService = {
  // ============================================================
  // GET ALL TAXES
  // ============================================================

  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TAXES.BASE);

    return response.data;
  },

  // ============================================================
  // GET TAX BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.TAXES.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE TAX
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.TAXES.BASE, payload);

    return response.data;
  },

  // ============================================================
  // UPDATE TAX
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.TAXES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE TAX
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.TAXES.BY_ID(id));

    return response.data;
  },
};

export default taxService;
