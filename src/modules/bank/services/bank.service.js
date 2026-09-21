import apiClient from "../../../services/api/apiClient.js";

import API_ENDPOINTS from "../../../services/api/endpoints.js";

const bankService = {
  // ============================================================
  // GET ALL BANKS
  // ============================================================

  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.BANKS.BASE);

    return response.data;
  },

  // ============================================================
  // GET BANK BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.BANKS.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE BANK
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.BANKS.BASE, payload);

    return response.data;
  },

  // ============================================================
  // UPDATE BANK
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.BANKS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE BANK
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.BANKS.BY_ID(id));

    return response.data;
  },
};

export default bankService;
