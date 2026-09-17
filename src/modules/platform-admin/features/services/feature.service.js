import apiClient from "../../../../services/api/apiClient";
import API_ENDPOINTS from "../../../../services/api/endpoints";

/**
 * ---------------------------------------------------------------------------
 * Feature Service
 * ---------------------------------------------------------------------------
 * Platform-level Feature API communication.
 * ---------------------------------------------------------------------------
 */

/**
 * GET /features
 * Fetch paginated / filtered features.
 */
const getFeatures = async (params = {}) => {
  return apiClient.get(API_ENDPOINTS.FEATURES.LIST, {
    params,
  });
};

/**
 * GET /features/:id
 * Fetch single feature by ID.
 */
const getFeatureById = async (id) => {
  return apiClient.get(API_ENDPOINTS.FEATURES.BY_ID(id));
};

/**
 * POST /features
 * Create a new feature.
 */
const createFeature = async (data) => {
  return apiClient.post(API_ENDPOINTS.FEATURES.CREATE, data);
};

/**
 * PUT /features/:id
 * Update an existing feature.
 */
const updateFeature = async (id, data) => {
  return apiClient.put(API_ENDPOINTS.FEATURES.BY_ID(id), data);
};

/**
 * PATCH /features/:id/activate
 * Activate feature.
 */
const activateFeature = async (id) => {
  return apiClient.patch(API_ENDPOINTS.FEATURES.ACTIVATE(id));
};

/**
 * PATCH /features/:id/deactivate
 * Deactivate feature.
 */
const deactivateFeature = async (id) => {
  return apiClient.patch(API_ENDPOINTS.FEATURES.DEACTIVATE(id));
};

/**
 * DELETE /features/:id
 * Delete feature.
 */
const deleteFeature = async (id) => {
  return apiClient.delete(API_ENDPOINTS.FEATURES.BY_ID(id));
};

/**
 * PATCH /features/:id/restore
 * Restore deleted feature.
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
