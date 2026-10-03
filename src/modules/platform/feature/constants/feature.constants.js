// =============================================================================
// Feature Constants
// =============================================================================

const FEATURE_TYPES = Object.freeze({
  MODULE: "module",
  FUNCTIONALITY: "functionality",
  LIMIT: "limit",
});

const FEATURE_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

const FEATURE_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 150,

  MIN_CODE_LENGTH: 2,
  MAX_CODE_LENGTH: 100,

  MAX_DESCRIPTION_LENGTH: 500,
});

const FEATURE_CONSTANTS = Object.freeze({
  TYPES: FEATURE_TYPES,
  STATUS: FEATURE_STATUS,
  LIMITS: FEATURE_LIMITS,
});

export { FEATURE_TYPES, FEATURE_STATUS, FEATURE_LIMITS };

export default FEATURE_CONSTANTS;
