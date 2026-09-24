import apiClient from "../../../services/api/apiClient.js";

// ============================================================
// ACCOUNTING BASE ENDPOINT
// ============================================================

const BASE_PATH = "/accounting";

// ============================================================
// RESPONSE HELPER
// ============================================================

const unwrapResponse = (response) => {
  return response?.data?.data ?? response?.data;
};

// ============================================================
// ACCOUNTING SERVICE
// ============================================================

const accountingService = {
  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------

  async createAccounting(payload) {
    const response = await apiClient.post(BASE_PATH, payload);

    return unwrapResponse(response);
  },

  // ----------------------------------------------------------
  // GET LIST
  // ----------------------------------------------------------

  async getAccountingTransactions(params = {}) {
    const response = await apiClient.get(BASE_PATH, {
      params,
    });

    return unwrapResponse(response);
  },

  // ----------------------------------------------------------
  // GET BY ID
  // ----------------------------------------------------------

  async getAccountingById(id) {
    const response = await apiClient.get(`${BASE_PATH}/${id}`);

    return unwrapResponse(response);
  },

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  async updateAccounting(id, payload) {
    const response = await apiClient.put(`${BASE_PATH}/${id}`, payload);

    return unwrapResponse(response);
  },

  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  async deleteAccounting(id) {
    const response = await apiClient.delete(`${BASE_PATH}/${id}`);

    return unwrapResponse(response);
  },
};

export default accountingService;
