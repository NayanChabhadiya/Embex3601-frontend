/**
 * -----------------------------------------------------------------------------
 * Embex360 Enterprise ERP
 * Subscription Plan Service
 * -----------------------------------------------------------------------------
 */

import apiClient from "../../../../services/api/apiClient";
import API_ENDPOINTS from "../../../../services/api/endpoints";

const getSubscriptionPlans = async (params = {}) => {
  return apiClient.get(API_ENDPOINTS.SUBSCRIPTION_PLANS.LIST, {
    params,
  });
};

const subscriptionPlanService = Object.freeze({
  getSubscriptionPlans,
});

export default subscriptionPlanService;
