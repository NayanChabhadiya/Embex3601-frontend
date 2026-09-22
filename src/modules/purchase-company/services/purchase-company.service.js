import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const purchaseCompanyService = {
  // ============================================================
  // GET ALL PURCHASE COMPANIES
  // ============================================================

  getAll: async (workspaceId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PURCHASE_COMPANIES.BASE,
      {
        params: {
          workspaceId,
        },
      },
    );

    return response.data;
  },

  // ============================================================
  // GET PURCHASE COMPANY BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PURCHASE_COMPANIES.BY_ID(id),
    );

    return response.data;
  },

  // ============================================================
  // CREATE PURCHASE COMPANY
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PURCHASE_COMPANIES.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE PURCHASE COMPANY
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.PURCHASE_COMPANIES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE PURCHASE COMPANY
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.PURCHASE_COMPANIES.BY_ID(id),
    );

    return response.data;
  },
};

export default purchaseCompanyService;
