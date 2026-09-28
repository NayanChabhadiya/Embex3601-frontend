// =============================================================================
// Account Messages
// =============================================================================

const ACCOUNT_MESSAGES = Object.freeze({
  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  CREATED: "Account created successfully.",
  CREATE_FAILED: "Failed to create account.",

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------

  FETCHED: "Account fetched successfully.",
  FETCHED_LIST: "Accounts fetched successfully.",
  NOT_FOUND: "Account not found.",
  FETCH_FAILED: "Failed to fetch account.",

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
  // Duplicate / Conflict
  // ---------------------------------------------------------------------------

  ALREADY_EXISTS: "Account already exists.",
  DUPLICATE_ACCOUNT: "An account with the provided details already exists.",

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  INVALID_ID: "Invalid account ID.",
  INVALID_STATUS: "Invalid account status.",
  INVALID_TYPE: "Invalid account type.",
  INVALID_VERIFICATION_STATUS: "Invalid account verification status.",
  INVALID_PLAN_STATUS: "Invalid account plan status.",

  // ---------------------------------------------------------------------------
  // Authentication / Authorization
  // ---------------------------------------------------------------------------

  AUTHENTICATION_REQUIRED: "Authentication is required.",
  UNAUTHORIZED: "You are not authorized to access this account.",
  FORBIDDEN: "You do not have permission to perform this action.",

  // ---------------------------------------------------------------------------
  // Scope / Ownership
  // ---------------------------------------------------------------------------

  ACCOUNT_ACCESS_DENIED: "Access to this account is denied.",
  ACCOUNT_OWNERSHIP_REQUIRED: "Account ownership is required for this action.",
  ACCOUNT_SCOPE_REQUIRED: "A valid account scope is required.",

  // ---------------------------------------------------------------------------
  // Account State
  // ---------------------------------------------------------------------------

  INACTIVE: "Account is inactive.",
  SUSPENDED: "Account is suspended.",
  DELETED_ACCOUNT: "Account has been deleted.",

  // ---------------------------------------------------------------------------
  // Update Restrictions
  // ---------------------------------------------------------------------------

  IMMUTABLE_FIELD: "One or more fields cannot be modified.",
  NO_UPDATABLE_FIELDS: "No valid fields were provided for update.",

  // ---------------------------------------------------------------------------
  // General
  // ---------------------------------------------------------------------------

  OPERATION_FAILED: "Account operation failed.",
});

export default ACCOUNT_MESSAGES;
