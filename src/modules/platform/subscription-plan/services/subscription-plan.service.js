import apiClient from "../../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../../services/api/endpoints.js";

// --------------------------------------------------------------------------
// Subscription Plan Service
// --------------------------------------------------------------------------

const subscriptionPlanService = {
  // ------------------------------------------------------------------------
  // Create Subscription Plan
  // ------------------------------------------------------------------------

  createSubscriptionPlan: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTION_PLANS.BASE,
      data,
    );

    return response.data;
  },

  // ------------------------------------------------------------------------
  // Get Subscription Plans - Platform Admin
  // ------------------------------------------------------------------------

  getSubscriptionPlans: async (params = {}) => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUBSCRIPTION_PLANS.BASE,
      {
        params,
      },
    );

    return response.data;
  },

  // ------------------------------------------------------------------------
  // Get Available Subscription Plans - Customer
  // ------------------------------------------------------------------------

  getAvailableSubscriptionPlans: async (params = {}) => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUBSCRIPTION_PLANS.AVAILABLE,
      {
        params,
      },
    );

    return response.data;
  },
};

export default subscriptionPlanService;
