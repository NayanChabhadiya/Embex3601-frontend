// =============================================================================
// Account Constants
// =============================================================================

const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  DELETED: "deleted",
});

const ACCOUNT_TYPES = Object.freeze({
  INDIVIDUAL: "individual",
  BUSINESS: "business",
  ENTERPRISE: "enterprise",
});

const ACCOUNT_VERIFICATION_STATUS = Object.freeze({
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
});

const ACCOUNT_PLAN_STATUS = Object.freeze({
  ACTIVE: "active",
  TRIAL: "trial",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
});

const ACCOUNT_SCOPES = Object.freeze({
  ACCOUNT: "account",
  WORKSPACE: "workspace",
  COMPANY: "company",
});

const ACCOUNT_ACCESS_LEVELS = Object.freeze({
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
  VIEWER: "viewer",
});

const ACCOUNT_PERMISSIONS = Object.freeze({
  CREATE: "account.create",
  READ: "account.read",
  UPDATE: "account.update",
  DELETE: "account.delete",
});

const ACCOUNT_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 150,

  MIN_SLUG_LENGTH: 2,
  MAX_SLUG_LENGTH: 100,

  MAX_DESCRIPTION_LENGTH: 500,

  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 30,

  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
});

const ACCOUNT_FILTERS = Object.freeze({
  STATUS: "status",
  TYPE: "type",
  VERIFICATION_STATUS: "verificationStatus",
  PLAN_STATUS: "planStatus",
});

const ACCOUNT_SORT = Object.freeze({
  CREATED_AT_ASC: "createdAt",
  CREATED_AT_DESC: "-createdAt",
  NAME_ASC: "name",
  NAME_DESC: "-name",
});

const ACCOUNT_IMMUTABLE_FIELDS = Object.freeze([
  "accountId",
  "ownerId",
  "createdBy",
  "createdAt",
]);

const ACCOUNT_EDITABLE_FIELDS = Object.freeze([
  "name",
  "slug",
  "type",
  "description",
  "email",
  "phone",
]);

const ACCOUNT_CONSTANTS = Object.freeze({
  STATUS: ACCOUNT_STATUS,
  TYPES: ACCOUNT_TYPES,
  VERIFICATION_STATUS: ACCOUNT_VERIFICATION_STATUS,
  PLAN_STATUS: ACCOUNT_PLAN_STATUS,
  SCOPES: ACCOUNT_SCOPES,
  ACCESS_LEVELS: ACCOUNT_ACCESS_LEVELS,
  PERMISSIONS: ACCOUNT_PERMISSIONS,
  LIMITS: ACCOUNT_LIMITS,
  FILTERS: ACCOUNT_FILTERS,
  SORT: ACCOUNT_SORT,
  IMMUTABLE_FIELDS: ACCOUNT_IMMUTABLE_FIELDS,
  EDITABLE_FIELDS: ACCOUNT_EDITABLE_FIELDS,
});

export {
  ACCOUNT_STATUS,
  ACCOUNT_TYPES,
  ACCOUNT_VERIFICATION_STATUS,
  ACCOUNT_PLAN_STATUS,
  ACCOUNT_SCOPES,
  ACCOUNT_ACCESS_LEVELS,
  ACCOUNT_PERMISSIONS,
  ACCOUNT_LIMITS,
  ACCOUNT_FILTERS,
  ACCOUNT_SORT,
  ACCOUNT_IMMUTABLE_FIELDS,
  ACCOUNT_EDITABLE_FIELDS,
};

export default ACCOUNT_CONSTANTS;
