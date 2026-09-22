import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const companyService = {
  // ============================================================
  // GET ALL COMPANIES
  // ============================================================

  getAll: async (workspaceId) => {
    const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BASE, {
      params: {
        workspaceId,
      },
    });

    return response.data;
  },

  // ============================================================
  // GET COMPANY BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE COMPANY
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.COMPANIES.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE COMPANY
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.COMPANIES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE COMPANY
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.COMPANIES.BY_ID(id));

    return response.data;
  },
};

export default companyService;
