import apiClient from "../../../../services/api/apiClient";
import API_ENDPOINTS from "../../../../services/api/endpoints";

const getPlanFeatures = async (subscriptionPlanId, params = {}) => {
  return apiClient.get(API_ENDPOINTS.PLAN_FEATURES.LIST(subscriptionPlanId), {
    params,
  });
};

const createPlanFeature = async (subscriptionPlanId, payload) => {
  return apiClient.post(
    API_ENDPOINTS.PLAN_FEATURES.CREATE(subscriptionPlanId),
    payload,
  );
};

const updatePlanFeature = async (subscriptionPlanId, featureId, payload) => {
  return apiClient.put(
    API_ENDPOINTS.PLAN_FEATURES.UPDATE(subscriptionPlanId, featureId),
    payload,
  );
};

const deletePlanFeature = async (subscriptionPlanId, featureId) => {
  return apiClient.delete(
    API_ENDPOINTS.PLAN_FEATURES.DELETE(subscriptionPlanId, featureId),
  );
};

const planFeatureService = Object.freeze({
  getPlanFeatures,
  createPlanFeature,
  updatePlanFeature,
  deletePlanFeature,
});

export default planFeatureService;
