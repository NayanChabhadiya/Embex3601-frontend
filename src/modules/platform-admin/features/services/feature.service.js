import apiClient from "../../../../services/api/apiClient";
import API_ENDPOINTS from "../../../../services/api/endpoints";

/**
 * =============================================================================
 * EMBEX360 ERP
 * Feature Service
 * =============================================================================
 *
 * Platform-level Feature API communication.
 * =============================================================================
 */

/**
 * GET /features
 */
const getFeatures = async (params = {}) => {
  return apiClient.get(API_ENDPOINTS.FEATURES.LIST, {
    params,
  });
};

/**
 * GET /features/:id
 */
const getFeatureById = async (id) => {
  return apiClient.get(API_ENDPOINTS.FEATURES.BY_ID(id));
};

/**
 * POST /features
 */
const createFeature = async (payload) => {
  return apiClient.post(API_ENDPOINTS.FEATURES.CREATE, payload);
};

/**
 * PUT /features/:id
 */
const updateFeature = async (id, payload) => {
  return apiClient.put(API_ENDPOINTS.FEATURES.BY_ID(id), payload);
};

/**
 * PATCH /features/:id/activate
 */
const activateFeature = async (id) => {
  return apiClient.patch(API_ENDPOINTS.FEATURES.ACTIVATE(id));
};

/**
 * PATCH /features/:id/deactivate
 */
const deactivateFeature = async (id) => {
  return apiClient.patch(API_ENDPOINTS.FEATURES.DEACTIVATE(id));
};

/**
 * DELETE /features/:id
 */
const deleteFeature = async (id) => {
  return apiClient.delete(API_ENDPOINTS.FEATURES.BY_ID(id));
};

/**
 * PATCH /features/:id/restore
 */
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
