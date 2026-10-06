// =============================================================================
// Account Messages
// =============================================================================

const ACCOUNT_MESSAGES = Object.freeze({
  // ---------------------------------------------------------------------------
  // Authentication / Authorization
  // ---------------------------------------------------------------------------

  AUTHENTICATION_REQUIRED: "Authentication is required.",
  ACCESS_DENIED: "Access denied.",
  FORBIDDEN: "You do not have permission to perform this action.",

  // ---------------------------------------------------------------------------
  // Subscription
  // ---------------------------------------------------------------------------

  SUBSCRIPTION_REQUIRED: "An active subscription is required.",
  SUBSCRIPTION_NOT_FOUND: "Subscription not found.",
  SUBSCRIPTION_ACCESS_DENIED:
    "You are not authorized to use this subscription.",

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  NAME_REQUIRED: "Account name is required.",
  CODE_REQUIRED: "Account code is required.",
  INVALID_TYPE: "Invalid account type.",
  INVALID_STATUS: "Invalid account status.",

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  ALREADY_EXISTS: "Account already exists.",
  NOT_FOUND: "Account not found.",

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  CREATED: "Account created successfully.",
  CREATE_FAILED: "Failed to create account.",

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  LIST_FETCHED: "Accounts fetched successfully.",
  LIST_FAILED: "Failed to fetch accounts.",

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  UPDATED: "Account updated successfully.",
  UPDATE_FAILED: "Failed to update account.",

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  DELETED: "Account deleted successfully.",
  DELETE_FAILED: "Failed to delete account.",

  // ---------------------------------------------------------------------------
  // General
  // ---------------------------------------------------------------------------

  OPERATION_FAILED: "Account operation failed.",
});

export default ACCOUNT_MESSAGES;
