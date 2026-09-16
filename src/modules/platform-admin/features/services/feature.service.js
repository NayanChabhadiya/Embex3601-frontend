import apiClient from "../../../../services/api/apiClient";
import API_ENDPOINTS from "../../../../services/api/endpoints";

const getFeatures = async (params = {}) => {
  return apiClient.get(API_ENDPOINTS.FEATURES.LIST, {
    params,
  });
};

const featureService = Object.freeze({
  getFeatures,
});

export default featureService;
