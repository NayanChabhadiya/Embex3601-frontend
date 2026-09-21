import apiClient from "../../../services/api/apiClient.js";

import API_ENDPOINTS from "../../../services/api/endpoints.js";

const hsnSacService = {
  // ============================================================
  // GET ALL HSN / SAC
  // ============================================================

  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.HSN_SAC.BASE);

    return response.data;
  },

  // ============================================================
  // GET HSN / SAC BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.HSN_SAC.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE HSN / SAC
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.HSN_SAC.BASE, payload);

    return response.data;
  },

  // ============================================================
  // UPDATE HSN / SAC
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.HSN_SAC.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE HSN / SAC
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.HSN_SAC.BY_ID(id));

    return response.data;
  },
};

export default hsnSacService;
