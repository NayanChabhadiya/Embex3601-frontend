// =============================================================================
// Plan Feature Service
// =============================================================================

import apiClient from "../../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../../services/api/endpoints.js";

// =============================================================================
// Create Plan Feature
// =============================================================================

const createPlanFeature = async (data) => {
  const response = await apiClient.post(API_ENDPOINTS.PLAN_FEATURES.BASE, data);

  return response.data;
};

// =============================================================================
// Get Plan Features
// =============================================================================

const getPlanFeatures = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.PLAN_FEATURES.BASE, {
    params,
  });

  return response.data;
};

// =============================================================================
// Export
// =============================================================================

const planFeatureService = Object.freeze({
  createPlanFeature,
  getPlanFeatures,
});

export default planFeatureService;
