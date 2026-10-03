// =============================================================================
// Subscription Plan Messages
// =============================================================================

const SUBSCRIPTION_PLAN_MESSAGES = Object.freeze({
  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  CREATED: "Subscription plan created successfully.",
  CREATE_FAILED: "Failed to create subscription plan.",

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  LIST_FETCHED: "Subscription plans fetched successfully.",

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  NAME_REQUIRED: "Subscription plan name is required.",
  CODE_REQUIRED: "Subscription plan code is required.",
  INVALID_TYPE: "Invalid subscription plan type.",
  INVALID_BILLING_CYCLE: "Invalid billing cycle.",
  INVALID_CURRENCY: "Invalid currency.",
  INVALID_PRICE: "Invalid subscription plan price.",
  INVALID_BILLING_INTERVAL: "Invalid billing interval.",

  // ---------------------------------------------------------------------------
  // Duplicate / Conflict
  // ---------------------------------------------------------------------------

  ALREADY_EXISTS: "Subscription plan already exists.",
  DUPLICATE_CODE: "A subscription plan with the provided code already exists.",

  // ---------------------------------------------------------------------------
  // Authentication / Authorization
  // ---------------------------------------------------------------------------

  AUTHENTICATION_REQUIRED: "Authentication is required.",
  UNAUTHORIZED: "You are not authorized to create a subscription plan.",
  FORBIDDEN: "You do not have permission to create a subscription plan.",

  // ---------------------------------------------------------------------------
  // General
  // ---------------------------------------------------------------------------

  OPERATION_FAILED: "Subscription plan operation failed.",
});

export default SUBSCRIPTION_PLAN_MESSAGES;
