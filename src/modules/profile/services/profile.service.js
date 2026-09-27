import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

// -----------------------------------------------------------------------------
// Profile Service
// -----------------------------------------------------------------------------

const profileService = Object.freeze({
  // ---------------------------------------------------------------------------
  // Get Current User Profile
  // ---------------------------------------------------------------------------

  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);

    return response.data;
  },
});

export default profileService;
