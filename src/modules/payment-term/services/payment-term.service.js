import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const paymentTermService = {
  // ============================================================
  // GET ALL PAYMENT TERMS
  // ============================================================

  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT_TERMS.BASE);

    return response.data;
  },

  // ============================================================
  // GET PAYMENT TERM BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT_TERMS.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE PAYMENT TERM
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PAYMENT_TERMS.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE PAYMENT TERM
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.PAYMENT_TERMS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE PAYMENT TERM
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.PAYMENT_TERMS.BY_ID(id),
    );

    return response.data;
  },
};

export default paymentTermService;
