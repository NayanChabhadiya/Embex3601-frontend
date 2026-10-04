// =============================================================================
// Account Service
// =============================================================================

import apiClient from "../../../../services/api/apiClient.js";

import API_ENDPOINTS from "../../../../services/api/endpoints.js";

// =============================================================================
// Endpoints
// =============================================================================

const ACCOUNT_ENDPOINT = API_ENDPOINTS.ACCOUNT;

// =============================================================================
// Create Account
// =============================================================================

const createAccount = async (data) => {
  return apiClient.post(ACCOUNT_ENDPOINT.BASE, data);
};

// =============================================================================
// Get Accounts
// =============================================================================

const getAccounts = async (params = {}) => {
  return apiClient.get(ACCOUNT_ENDPOINT.BASE, {
    params,
  });
};

// =============================================================================
// Export
// =============================================================================

const accountService = Object.freeze({
  createAccount,
  getAccounts,
});

export default accountService;
