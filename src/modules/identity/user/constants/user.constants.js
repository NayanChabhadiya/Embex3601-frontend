// --------------------------------------------------------------------------
// User Types
// --------------------------------------------------------------------------

export const USER_TYPE = Object.freeze({
  PLATFORM_ADMIN: "platform_admin",
  CUSTOMER_ADMIN: "customer_admin",
  CUSTOMER_USER: "customer_user",
});

// --------------------------------------------------------------------------
// User Status
// --------------------------------------------------------------------------

export const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

// --------------------------------------------------------------------------
// User Verification Status
// --------------------------------------------------------------------------

export const USER_VERIFICATION_STATUS = Object.freeze({
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
});

// --------------------------------------------------------------------------
// User Pagination
// --------------------------------------------------------------------------

export const USER_PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

// --------------------------------------------------------------------------
// User Constants
// --------------------------------------------------------------------------

const USER_CONSTANTS = Object.freeze({
  USER_TYPE,
  USER_STATUS,
  USER_VERIFICATION_STATUS,
  USER_PAGINATION,
});

export default USER_CONSTANTS;
