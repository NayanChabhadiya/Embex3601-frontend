import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const financialYearService = {
  // ============================================================
  // GET ALL FINANCIAL YEARS
  // ============================================================

  getAll: async (workspaceId, companyId) => {
    const response = await apiClient.get(API_ENDPOINTS.FINANCIAL_YEARS.BASE, {
      params: {
        workspaceId,
        companyId,
      },
    });

    return response.data;
  },

  // ============================================================
  // GET FINANCIAL YEAR BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(
      API_ENDPOINTS.FINANCIAL_YEARS.BY_ID(id),
    );

    return response.data;
  },

  // ============================================================
  // CREATE FINANCIAL YEAR
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.FINANCIAL_YEARS.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE FINANCIAL YEAR
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.FINANCIAL_YEARS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE FINANCIAL YEAR
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.FINANCIAL_YEARS.BY_ID(id),
    );

    return response.data;
  },
};

export default financialYearService;
