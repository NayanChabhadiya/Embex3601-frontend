// =============================================================================
// Account Constants
// =============================================================================

// =============================================================================
// User Types
// =============================================================================

export const ACCOUNT_ALLOWED_USER_TYPES = Object.freeze(["customer_user"]);

// =============================================================================
// Account Types
// =============================================================================

export const ACCOUNT_TYPES = Object.freeze({
  BUSINESS: "business",
});

// =============================================================================
// Account Status
// =============================================================================

export const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
});

// =============================================================================
// Account Permissions
// =============================================================================

export const ACCOUNT_PERMISSIONS = Object.freeze({
  CREATE: "account.create",
  READ: "account.read",
  UPDATE: "account.update",
  DELETE: "account.delete",
});

// =============================================================================
// Account Defaults
// =============================================================================

export const ACCOUNT_DEFAULTS = Object.freeze({
  TYPE: ACCOUNT_TYPES.BUSINESS,
  STATUS: ACCOUNT_STATUS.ACTIVE,
});

// =============================================================================
// Account Limits
// =============================================================================

export const ACCOUNT_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 150,

  MIN_CODE_LENGTH: 2,
  MAX_CODE_LENGTH: 100,

  MAX_LIST_LIMIT: 100,
});
