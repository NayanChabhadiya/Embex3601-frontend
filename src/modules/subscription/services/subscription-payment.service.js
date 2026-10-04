// =============================================================================
// Subscription Payment Service
// =============================================================================

import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

// =============================================================================
// Service
// =============================================================================

const subscriptionPaymentService = {
  createPaymentOrder: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.ORDER,
      data,
    );

    return response.data;
  },

  verifyPayment: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.VERIFY,
      data,
    );

    return response.data;
  },

  getPaymentById: async (paymentId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.BY_ID(paymentId),
    );

    return response.data;
  },
};

export default subscriptionPaymentService;
