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

const getSubscriptionPlanById = async (id) => {
  return apiClient.get(API_ENDPOINTS.SUBSCRIPTION_PLANS.BY_ID(id));
};

const updateSubscriptionPlan = async (id, payload) => {
  return apiClient.put(API_ENDPOINTS.SUBSCRIPTION_PLANS.UPDATE(id), payload);
};

const subscriptionPlanService = Object.freeze({
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
});

export default subscriptionPlanService;
