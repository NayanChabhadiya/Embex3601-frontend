import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

// ============================================================
// RESPONSE HELPER
// ============================================================

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data;
};

// ============================================================
// SALES SERVICE
// ============================================================

const salesService = {
  // ==========================================================
  // CREATE
  // ==========================================================

  async createSales(payload) {
    const response = await apiClient.post(API_ENDPOINTS.SALES.BASE, payload);

    return getResponseData(response);
  },

  // ==========================================================
  // GET ALL
  // ==========================================================

  async getSales(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.SALES.BASE, {
      params,
    });

    return getResponseData(response);
  },

  // ==========================================================
  // GET BY ID
  // ==========================================================

  async getSalesById(id) {
    const response = await apiClient.get(API_ENDPOINTS.SALES.BY_ID(id));

    return getResponseData(response);
  },

  // ==========================================================
  // UPDATE
  // ==========================================================

  async updateSales(id, payload) {
    const response = await apiClient.put(
      API_ENDPOINTS.SALES.BY_ID(id),
      payload,
    );

    return getResponseData(response);
  },

  // ==========================================================
  // DELETE
  // ==========================================================

  async deleteSales(id) {
    const response = await apiClient.delete(API_ENDPOINTS.SALES.BY_ID(id));

    return getResponseData(response);
  },
};

export default salesService;
