// =============================================================================
// Company Messages
// =============================================================================

const COMPANY_MESSAGES = Object.freeze({
  // ---------------------------------------------------------------------------
  // Authentication / Authorization
  // ---------------------------------------------------------------------------

  AUTHENTICATION_REQUIRED: "Authentication is required.",
  ACCESS_DENIED: "Access denied.",
  FORBIDDEN: "You do not have permission to perform this action.",

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  NAME_REQUIRED: "Company name is required.",
  CODE_REQUIRED: "Company code is required.",
  INVALID_TYPE: "Invalid company type.",
  INVALID_STATUS: "Invalid company status.",
  INVALID_GSTIN: "Invalid GSTIN.",
  INVALID_PAN: "Invalid PAN.",
  INVALID_CIN: "Invalid CIN.",
  INVALID_EMAIL: "Invalid email address.",

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  ACCOUNT_REQUIRED: "Account is required.",
  ACCOUNT_NOT_FOUND: "Account not found.",
  ACCOUNT_ACCESS_DENIED: "You are not authorized to access this account.",

  // ---------------------------------------------------------------------------
  // Subscription / Company Limit
  // ---------------------------------------------------------------------------

  SUBSCRIPTION_REQUIRED: "An active subscription is required.",
  SUBSCRIPTION_INVALID: "The subscription is invalid or inactive.",
  COMPANY_LIMIT_REACHED:
    "Your subscription plan company limit has been reached.",

  // ---------------------------------------------------------------------------
  // Duplicate
  // ---------------------------------------------------------------------------

  ALREADY_EXISTS: "Company already exists.",

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  CREATED: "Company created successfully.",
  CREATE_FAILED: "Failed to create company.",

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  LIST_FETCHED: "Companies fetched successfully.",
  LIST_FAILED: "Failed to fetch companies.",

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  UPDATED: "Company updated successfully.",
  UPDATE_FAILED: "Failed to update company.",

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  DELETED: "Company deleted successfully.",
  DELETE_FAILED: "Failed to delete company.",

  // ---------------------------------------------------------------------------
  // General
  // ---------------------------------------------------------------------------

  NOT_FOUND: "Company not found.",
  OPERATION_FAILED: "Company operation failed.",
});

export default COMPANY_MESSAGES;
