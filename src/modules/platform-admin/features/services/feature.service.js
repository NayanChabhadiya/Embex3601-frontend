const getFeatures = async (params = {}) => {
  return apiClient.get(API_ENDPOINTS.FEATURES.LIST, {
    params,
  });
};

const getFeatureById = async (id) => {
  return apiClient.get(API_ENDPOINTS.FEATURES.BY_ID(id));
};

const createFeature = async (data) => {
  return apiClient.post(API_ENDPOINTS.FEATURES.CREATE, data);
};

const updateFeature = async (id, data) => {
  return apiClient.put(API_ENDPOINTS.FEATURES.BY_ID(id), data);
};

const activateFeature = async (id) => {
  return apiClient.patch(API_ENDPOINTS.FEATURES.ACTIVATE(id));
};

const deactivateFeature = async (id) => {
  return apiClient.patch(API_ENDPOINTS.FEATURES.DEACTIVATE(id));
};

const deleteFeature = async (id) => {
  return apiClient.delete(API_ENDPOINTS.FEATURES.BY_ID(id));
};

const restoreFeature = async (id) => {
  return apiClient.patch(API_ENDPOINTS.FEATURES.RESTORE(id));
};

const featureService = Object.freeze({
  getFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  activateFeature,
  deactivateFeature,
  deleteFeature,
  restoreFeature,
});

export default featureService;
