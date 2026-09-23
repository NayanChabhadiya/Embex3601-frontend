import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const partnerService = {
  // ============================================================
  // GET ALL PARTNERS
  // ============================================================

  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PARTNERS.BASE, {
      params,
    });

    return response.data;
  },

  // ============================================================
  // GET PARTNER BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PARTNERS.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE PARTNER
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.PARTNERS.BASE, payload);

    return response.data;
  },

  // ============================================================
  // UPDATE PARTNER
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.PARTNERS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE PARTNER
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.PARTNERS.BY_ID(id));

    return response.data;
  },
};

export default partnerService;
