import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const currencyService = {
  // ============================================================
  // GET ALL CURRENCIES
  // ============================================================

  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CURRENCIES.BASE);

    return response.data;
  },

  // ============================================================
  // GET CURRENCY BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.CURRENCIES.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE CURRENCY
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.CURRENCIES.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE CURRENCY
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.CURRENCIES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE CURRENCY
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.CURRENCIES.BY_ID(id));

    return response.data;
  },
};

export default currencyService;
