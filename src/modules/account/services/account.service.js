// =============================================================================
// Account Service
// =============================================================================

import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";
import ACCOUNT_MESSAGES from "../constants/account.messages.js";

// =============================================================================
// Helpers
// =============================================================================

const getAccountEndpoint = (accountId = null) => {
  if (!accountId) {
    return API_ENDPOINTS.ACCOUNTS;
  }

  return `${API_ENDPOINTS.ACCOUNTS}/${encodeURIComponent(accountId)}`;
};

const normalizeRequestError = (error, fallbackMessage) => {
  const response = error?.response;
  const data = response?.data;

  const normalizedError = new Error(
    data?.message || error?.message || fallbackMessage,
  );

  normalizedError.statusCode = response?.status;
  normalizedError.errorCode =
    data?.errorCode || data?.code || "ACCOUNT_OPERATION_FAILED";
  normalizedError.details = data?.details ?? null;
  normalizedError.fields = data?.fields ?? null;

  return normalizedError;
};

// =============================================================================
// Create Account
// =============================================================================

const createAccount = async (payload) => {
  try {
    const response = await apiClient.post(getAccountEndpoint(), payload);

    return response.data;
  } catch (error) {
    throw normalizeRequestError(error, ACCOUNT_MESSAGES.CREATE_FAILED);
  }
};

// =============================================================================
// Get Accounts
// =============================================================================

const getAccounts = async ({
  page = 1,
  limit = 10,
  status,
  type,
  verificationStatus,
  planStatus,
} = {}) => {
  try {
    const params = {
      page,
      limit,
    };

    if (status) {
      params.status = status;
    }

    if (type) {
      params.type = type;
    }

    if (verificationStatus) {
      params.verificationStatus = verificationStatus;
    }

    if (planStatus) {
      params.planStatus = planStatus;
    }

    const response = await apiClient.get(getAccountEndpoint(), {
      params,
    });

    return response.data;
  } catch (error) {
    throw normalizeRequestError(error, ACCOUNT_MESSAGES.FETCH_FAILED);
  }
};

// =============================================================================
// Get Account By ID
// =============================================================================

const getAccountById = async (accountId) => {
  try {
    const response = await apiClient.get(getAccountEndpoint(accountId));

    return response.data;
  } catch (error) {
    throw normalizeRequestError(error, ACCOUNT_MESSAGES.FETCH_FAILED);
  }
};

// =============================================================================
// Update Account
// =============================================================================

const updateAccount = async (accountId, payload) => {
  try {
    const response = await apiClient.patch(
      getAccountEndpoint(accountId),
      payload,
    );

    return response.data;
  } catch (error) {
    throw normalizeRequestError(error, ACCOUNT_MESSAGES.UPDATE_FAILED);
  }
};

// =============================================================================
// Delete Account
// =============================================================================

const deleteAccount = async (accountId) => {
  try {
    const response = await apiClient.delete(getAccountEndpoint(accountId));

    return response.data;
  } catch (error) {
    throw normalizeRequestError(error, ACCOUNT_MESSAGES.DELETE_FAILED);
  }
};

// =============================================================================
// Export
// =============================================================================

const accountService = Object.freeze({
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
});

export default accountService;
