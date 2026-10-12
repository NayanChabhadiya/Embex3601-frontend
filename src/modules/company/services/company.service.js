// =============================================================================
// Company Service
// =============================================================================

import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const COMPANY_ENDPOINT = API_ENDPOINTS.COMPANY;

// =============================================================================
// Create Company
// =============================================================================

const createCompany = async (data) => {
  return apiClient.post(COMPANY_ENDPOINT.BASE, data);
};

// =============================================================================
// Get Companies
// =============================================================================

const getCompanies = async (params = {}) => {
  return apiClient.get(COMPANY_ENDPOINT.BASE, {
    params,
  });
};

// =============================================================================
// Export
// =============================================================================

const companyService = Object.freeze({
  createCompany,
  getCompanies,
});

export default companyService;
