import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const bankAccountService = {
  // ============================================================
  // GET ALL BANK ACCOUNTS
  // ============================================================
  getAll: async (companyId, branchId = null) => {
    const response = await apiClient.get(API_ENDPOINTS.BANK_ACCOUNTS.BASE, {
      params: {
        companyId,
        ...(branchId ? { branchId } : {}),
      },
    });

    return response.data;
  },

  // ============================================================
  // GET BANK ACCOUNT BY ID
  // ============================================================
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.BANK_ACCOUNTS.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE BANK ACCOUNT
  // ============================================================
  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.BANK_ACCOUNTS.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE BANK ACCOUNT
  // ============================================================
  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.BANK_ACCOUNTS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE BANK ACCOUNT
  // ============================================================
  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.BANK_ACCOUNTS.BY_ID(id),
    );

    return response.data;
  },
};

export default bankAccountService;
