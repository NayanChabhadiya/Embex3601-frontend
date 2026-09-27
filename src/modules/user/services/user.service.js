import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

// --------------------------------------------------------------------------
// User Service
// --------------------------------------------------------------------------

const userService = {
  // ------------------------------------------------------------------------
  // Create User
  // ------------------------------------------------------------------------

  createUser: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, data);

    return response.data;
  },

  // ------------------------------------------------------------------------
  // Get Users
  // ------------------------------------------------------------------------

  getUsers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, {
      params,
    });

    return response.data;
  },

  // ------------------------------------------------------------------------
  // Get User By ID
  // ------------------------------------------------------------------------

  getUserById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));

    return response.data;
  },

  // ------------------------------------------------------------------------
  // Update User
  // ------------------------------------------------------------------------

  updateUser: async (id, data) => {
    const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), data);

    return response.data;
  },

  // ------------------------------------------------------------------------
  // Delete User
  // ------------------------------------------------------------------------

  deleteUser: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));

    return response.data;
  },
};

export default userService;
