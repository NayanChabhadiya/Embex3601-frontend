// =============================================================================
// Company Constants
// =============================================================================

export const COMPANY_ALLOWED_USER_TYPES = Object.freeze(["customer_user"]);

export const COMPANY_TYPES = Object.freeze({
  PRIVATE_LIMITED: "private_limited",
  PUBLIC_LIMITED: "public_limited",
  LLP: "llp",
  PARTNERSHIP: "partnership",
  PROPRIETORSHIP: "proprietorship",
  HUF: "huf",
  TRUST: "trust",
  SOCIETY: "society",
  OTHER: "other",
});

export const COMPANY_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

export const COMPANY_PERMISSIONS = Object.freeze({
  CREATE: "company.create",
  READ: "company.read",
  UPDATE: "company.update",
  DELETE: "company.delete",
});

export const COMPANY_DEFAULTS = Object.freeze({
  STATUS: COMPANY_STATUS.ACTIVE,
});

export const COMPANY_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 200,

  MIN_CODE_LENGTH: 2,
  MAX_CODE_LENGTH: 50,

  MAX_LEGAL_NAME_LENGTH: 250,
  MAX_DESCRIPTION_LENGTH: 500,

  MAX_GSTIN_LENGTH: 15,
  MAX_PAN_LENGTH: 10,
  MAX_CIN_LENGTH: 21,

  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 20,

  MAX_ADDRESS_LENGTH: 500,
  MAX_PINCODE_LENGTH: 10,

  MAX_LIST_LIMIT: 100,
});
