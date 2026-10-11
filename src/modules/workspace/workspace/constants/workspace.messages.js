// =============================================================================
// Workspace Messages
// =============================================================================

const WORKSPACE_MESSAGES = Object.freeze({
  // ---------------------------------------------------------------------------
  // Authentication / Authorization
  // ---------------------------------------------------------------------------

  AUTHENTICATION_REQUIRED: "Authentication is required.",
  ACCESS_DENIED: "Access denied.",
  FORBIDDEN: "You do not have permission to perform this action.",

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  NAME_REQUIRED: "Workspace name is required.",
  CODE_REQUIRED: "Workspace code is required.",
  INVALID_TYPE: "Invalid workspace type.",
  INVALID_STATUS: "Invalid workspace status.",

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  ACCOUNT_REQUIRED: "Account is required.",
  ACCOUNT_NOT_FOUND: "Account not found.",
  ACCOUNT_ACCESS_DENIED: "You are not authorized to access this account.",

  // ---------------------------------------------------------------------------
  // Duplicate
  // ---------------------------------------------------------------------------

  ALREADY_EXISTS: "Workspace already exists.",

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  CREATED: "Workspace created successfully.",
  CREATE_FAILED: "Failed to create workspace.",

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  LIST_FETCHED: "Workspaces fetched successfully.",
  LIST_FAILED: "Failed to fetch workspaces.",

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  UPDATED: "Workspace updated successfully.",
  UPDATE_FAILED: "Failed to update workspace.",

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  DELETED: "Workspace deleted successfully.",
  DELETE_FAILED: "Failed to delete workspace.",

  // ---------------------------------------------------------------------------
  // General
  // ---------------------------------------------------------------------------

  NOT_FOUND: "Workspace not found.",
  OPERATION_FAILED: "Workspace operation failed.",
});

export default WORKSPACE_MESSAGES;
