// =============================================================================
// Plan Feature Messages
// =============================================================================

const PLAN_FEATURE_MESSAGES = Object.freeze({
  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  AUTHENTICATION_REQUIRED: "Authentication is required.",

  // ---------------------------------------------------------------------------
  // Authorization
  // ---------------------------------------------------------------------------

  ACCESS_DENIED: "Access denied.",

  FORBIDDEN: "You are not authorized to perform this action.",

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  PLAN_ID_REQUIRED: "Subscription plan is required.",

  FEATURE_ID_REQUIRED: "Feature is required.",

  INVALID_PLAN_ID: "Invalid subscription plan.",

  INVALID_FEATURE_ID: "Invalid feature.",

  INVALID_STATUS: "Invalid plan feature status.",

  // ---------------------------------------------------------------------------
  // Duplicate
  // ---------------------------------------------------------------------------

  ALREADY_EXISTS: "Plan feature already exists.",

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  CREATED: "Plan feature created successfully.",

  CREATE_FAILED: "Failed to create plan feature.",

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  LIST_FETCHED: "Plan features fetched successfully.",

  OPERATION_FAILED: "Plan feature operation failed.",
});

export default PLAN_FEATURE_MESSAGES;
