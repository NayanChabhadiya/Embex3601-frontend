import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const workspaceMembershipService = {
  getAll: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.WORKSPACE_MEMBERSHIPS.BASE,
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(
      API_ENDPOINTS.WORKSPACE_MEMBERSHIPS.BY_ID(id),
    );

    return response.data;
  },

  create: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.WORKSPACE_MEMBERSHIPS.BASE,
      payload,
    );

    return response.data;
  },

  update: async (id, payload) => {
    const response = await apiClient.put(
      API_ENDPOINTS.WORKSPACE_MEMBERSHIPS.BY_ID(id),
      payload,
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.WORKSPACE_MEMBERSHIPS.BY_ID(id),
    );

    return response.data;
  },
};

export default workspaceMembershipService;
