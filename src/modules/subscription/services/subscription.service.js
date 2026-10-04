import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

// --------------------------------------------------------------------------
// Subscription Service
// --------------------------------------------------------------------------

const subscriptionService = {
  // ------------------------------------------------------------------------
  // Create Subscription
  // ------------------------------------------------------------------------

  createSubscription: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTIONS.BASE,
      data,
    );

    return response.data;
  },

  // ------------------------------------------------------------------------
  // Get Active Subscription
  // ------------------------------------------------------------------------

  getActiveSubscription: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.ACTIVE);

    return response.data;
  },
};

export default subscriptionService;
