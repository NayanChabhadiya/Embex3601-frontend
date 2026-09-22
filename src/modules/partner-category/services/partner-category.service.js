import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const partnerCategoryService = {
  // ============================================================
  // GET ALL PARTNER CATEGORIES
  // ============================================================

  getAll: async (workspaceId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PARTNER_CATEGORIES.BASE,
      {
        params: {
          workspaceId,
        },
      },
    );

    return response.data;
  },

  // ============================================================
  // GET PARTNER CATEGORY BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PARTNER_CATEGORIES.BY_ID(id),
    );

    return response.data;
  },

  // ============================================================
  // CREATE PARTNER CATEGORY
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PARTNER_CATEGORIES.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE PARTNER CATEGORY
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.PARTNER_CATEGORIES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE PARTNER CATEGORY
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.PARTNER_CATEGORIES.BY_ID(id),
    );

    return response.data;
  },
};

export default partnerCategoryService;
