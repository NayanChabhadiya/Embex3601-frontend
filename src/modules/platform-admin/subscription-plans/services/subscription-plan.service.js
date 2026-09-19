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

/**
 * POST /subscription-plans
 */
const createSubscriptionPlan = async (payload) => {
  return apiClient.post(API_ENDPOINTS.SUBSCRIPTION_PLANS.CREATE, payload);
};

/**
 * GET /subscription-plans/active
 */
const getActiveSubscriptionPlans = async () => {
  return apiClient.get(API_ENDPOINTS.SUBSCRIPTION_PLANS.ACTIVE);
};

/**
 * PATCH /subscription-plans/:id/activate
 */
const activateSubscriptionPlan = async (id) => {
  return apiClient.patch(API_ENDPOINTS.SUBSCRIPTION_PLANS.ACTIVATE(id));
};

/**
 * PATCH /subscription-plans/:id/deactivate
 */
const deactivateSubscriptionPlan = async (id) => {
  return apiClient.patch(API_ENDPOINTS.SUBSCRIPTION_PLANS.DEACTIVATE(id));
};

/**
 * DELETE /subscription-plans/:id
 */
const deleteSubscriptionPlan = async (id) => {
  return apiClient.delete(API_ENDPOINTS.SUBSCRIPTION_PLANS.BY_ID(id));
};

/**
 * PATCH /subscription-plans/:id/restore
 */
const restoreSubscriptionPlan = async (id) => {
  return apiClient.patch(API_ENDPOINTS.SUBSCRIPTION_PLANS.RESTORE(id));
};

const subscriptionPlanService = Object.freeze({
  getSubscriptionPlans,
  getActiveSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  activateSubscriptionPlan,
  deactivateSubscriptionPlan,
  deleteSubscriptionPlan,
  restoreSubscriptionPlan,
});

export default subscriptionPlanService;
