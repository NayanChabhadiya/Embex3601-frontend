// =============================================================================
// Workspace Constants
// =============================================================================

export const WORKSPACE_ALLOWED_USER_TYPES = Object.freeze(["customer_user"]);

export const WORKSPACE_TYPES = Object.freeze({
  BUSINESS_UNIT: "business_unit",
});

export const WORKSPACE_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
});

export const WORKSPACE_PERMISSIONS = Object.freeze({
  CREATE: "workspace.create",
  READ: "workspace.read",
  UPDATE: "workspace.update",
  DELETE: "workspace.delete",
});

export const WORKSPACE_DEFAULTS = Object.freeze({
  TYPE: WORKSPACE_TYPES.BUSINESS_UNIT,
  STATUS: WORKSPACE_STATUS.ACTIVE,
});

export const WORKSPACE_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 150,

  MIN_CODE_LENGTH: 2,
  MAX_CODE_LENGTH: 100,

  MAX_DESCRIPTION_LENGTH: 500,

  MAX_LIST_LIMIT: 100,
});
