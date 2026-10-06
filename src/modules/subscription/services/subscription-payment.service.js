// =============================================================================
// Subscription Payment Service
// =============================================================================

import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

// =============================================================================
// Service
// =============================================================================

const subscriptionPaymentService = {
  // ---------------------------------------------------------------------------
  // Create Payment Order
  // ---------------------------------------------------------------------------

  createPaymentOrder: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.ORDER,
      data,
    );

    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Customer Manual Payment Submission
  // ---------------------------------------------------------------------------

  verifyPayment: async (data) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.VERIFY,
      data,
    );

    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Platform Admin - Get Pending Manual Payments
  // ---------------------------------------------------------------------------

  getPendingManualPayments: async ({ page = 1, limit = 20 } = {}) => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.PENDING,
      {
        params: {
          page,
          limit,
        },
      },
    );

    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Platform Admin Manual Payment Verification
  // ---------------------------------------------------------------------------

  verifyManualPayment: async (paymentId) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.MANUAL_VERIFY(paymentId),
    );

    return response.data;
  },

  // ---------------------------------------------------------------------------
  // Get Payment By ID
  // ---------------------------------------------------------------------------

  getPaymentById: async (paymentId) => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS.BY_ID(paymentId),
    );

    return response.data;
  },
};

export default subscriptionPaymentService;
