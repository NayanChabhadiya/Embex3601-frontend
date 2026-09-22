import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const itemService = {
  // ============================================================
  // GET ALL ITEMS
  // ============================================================

  getAll: async (workspaceId) => {
    const response = await apiClient.get(API_ENDPOINTS.ITEMS.BASE, {
      params: {
        workspaceId,
      },
    });

    return response.data;
  },

  // ============================================================
  // GET ITEM BY ID
  // ============================================================

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ITEMS.BY_ID(id));

    return response.data;
  },

  // ============================================================
  // CREATE ITEM
  // ============================================================

  create: async (payload) => {
    const response = await apiClient.post(API_ENDPOINTS.ITEMS.BASE, payload);

    return response.data;
  },

  // ============================================================
  // UPDATE ITEM
  // ============================================================

  update: async (id, payload) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.ITEMS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  // ============================================================
  // DELETE ITEM
  // ============================================================

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.ITEMS.BY_ID(id));

    return response.data;
  },
};

export default itemService;
