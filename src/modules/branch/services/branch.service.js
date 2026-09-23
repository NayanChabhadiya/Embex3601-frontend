import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const branchService = {
  // ============================================================
  // GET ALL BRANCHES
  // ============================================================
  getAll: async (companyId) => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCHES.BASE, {
      params: {
        companyId,
      },
    });

    return response.data;
  },

  // ============================================================
  // GET BRANCH BY ID
  // ============================================================
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.BRANCHES.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE BRANCH
  // ============================================================
  create: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.BRANCHES.BASE, payload);

    return response.data;
  },

  // ============================================================
  // UPDATE BRANCH
  // ============================================================
  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.BRANCHES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE BRANCH
  // ============================================================
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.BRANCHES.BY_ID(id));

    return response.data;
  },
};

export default branchService;
