import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const productCategoryService = {
  // ============================================================
  // GET ALL PRODUCT CATEGORIES
  // ============================================================

  getAll: async (workspaceId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BASE,
      {
        params: {
          workspaceId,
        },
      },
    );

    return response.data;
  },

  // ============================================================
  // GET PRODUCT CATEGORY BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BY_ID(id),
    );

    return response.data;
  },

  // ============================================================
  // CREATE PRODUCT CATEGORY
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BASE,
      payload,
    );

    return response.data;
  },

  // ============================================================
  // UPDATE PRODUCT CATEGORY
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE PRODUCT CATEGORY
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BY_ID(id),
    );

    return response.data;
  },
};

export default productCategoryService;
