// =============================================================================
// Feature Service
// =============================================================================

import apiClient from "../../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../../services/api/endpoints.js";

// =============================================================================
// Feature Service
// =============================================================================

const featureService = {
  // ---------------------------------------------------------------------------
  // Create Feature
  // ---------------------------------------------------------------------------

  createFeature: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.FEATURES.BASE, data);

    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Get Features
  // ---------------------------------------------------------------------------

  getFeatures: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.FEATURES.BASE, {
      params,
    });

    return response.data;
  },
};

export default featureService;
