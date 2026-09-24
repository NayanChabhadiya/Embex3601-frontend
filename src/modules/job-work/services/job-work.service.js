import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

// ============================================================
// RESPONSE HELPER
// ============================================================

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data;
};

// ============================================================
// JOB WORK SERVICE
// ============================================================

const jobWorkService = {
  // ==========================================================
  // CREATE
  // ==========================================================

  async createJobWork(payload) {
    const response = await apiClient.post(
      API_ENDPOINTS.JOB_WORKS.BASE,
      payload,
    );

    return getResponseData(response);
  },

  // ==========================================================
  // GET ALL
  // ==========================================================

  async getJobWorks(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.JOB_WORKS.BASE, {
      params,
    });

    return getResponseData(response);
  },

  // ==========================================================
  // GET BY ID
  // ==========================================================

  async getJobWorkById(id) {
    const response = await apiClient.get(API_ENDPOINTS.JOB_WORKS.BY_ID(id));

    return getResponseData(response);
  },

  // ==========================================================
  // UPDATE
  // ==========================================================

  async updateJobWork(id, payload) {
    const response = await apiClient.put(
      API_ENDPOINTS.JOB_WORKS.BY_ID(id),
      payload,
    );

    return getResponseData(response);
  },

  // ==========================================================
  // DELETE
  // ==========================================================

  async deleteJobWork(id) {
    const response = await apiClient.delete(API_ENDPOINTS.JOB_WORKS.BY_ID(id));

    return getResponseData(response);
  },
};

export default jobWorkService;
