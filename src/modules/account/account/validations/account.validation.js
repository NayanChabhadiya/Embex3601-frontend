// =============================================================================
// Account Validation
// =============================================================================

import {
  ACCOUNT_TYPES,
  ACCOUNT_STATUS,
  ACCOUNT_LIMITS,
} from "../constants/account.constants.js";

// -----------------------------------------------------------------------------
// Common Validation Rules
// -----------------------------------------------------------------------------

const validateRequired = (value) => {
  if (value === undefined || value === null || value === "") {
    return "This field is required.";
  }

  return "";
};

const validateStringLength = (value, min, max) => {
  if (!value) {
    return "";
  }

  if (value.length < min) {
    return `Minimum ${min} characters required.`;
  }

  if (value.length > max) {
    return `Maximum ${max} characters allowed.`;
  }

  return "";
};

// -----------------------------------------------------------------------------
// Name Validation
// -----------------------------------------------------------------------------

const validateName = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Account name is required.";
  }

  return validateStringLength(
    value.trim(),
    ACCOUNT_LIMITS.MIN_NAME_LENGTH,
    ACCOUNT_LIMITS.MAX_NAME_LENGTH,
  );
};

// -----------------------------------------------------------------------------
// Code Validation
// -----------------------------------------------------------------------------

const validateCode = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Account code is required.";
  }

  const normalizedCode = value.trim();

  const lengthError = validateStringLength(
    normalizedCode,
    ACCOUNT_LIMITS.MIN_CODE_LENGTH,
    ACCOUNT_LIMITS.MAX_CODE_LENGTH,
  );

  if (lengthError) {
    return lengthError;
  }

  if (!/^[A-Z0-9_-]+$/i.test(normalizedCode)) {
    return "Account code contains invalid characters.";
  }

  return "";
};

// -----------------------------------------------------------------------------
// Type Validation
// -----------------------------------------------------------------------------

const validateType = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Account type is required.";
  }

  if (!Object.values(ACCOUNT_TYPES).includes(value)) {
    return "Invalid account type.";
  }

  return "";
};

// =============================================================================
// Create Account Validation
// =============================================================================

export const validateCreateAccount = (values = {}) => {
  const errors = {};

  // ---------------------------------------------------------------------------
  // Name
  // ---------------------------------------------------------------------------

  const nameError = validateName(values.name);

  if (nameError) {
    errors.name = nameError;
  }

  // ---------------------------------------------------------------------------
  // Code
  // ---------------------------------------------------------------------------

  const codeError = validateCode(values.code);

  if (codeError) {
    errors.code = codeError;
  }

  // ---------------------------------------------------------------------------
  // Type
  // ---------------------------------------------------------------------------

  const typeError = validateType(values.type);

  if (typeError) {
    errors.type = typeError;
  }

  return errors;
};

// =============================================================================
// Account List Validation
// =============================================================================

export const validateAccountList = (values = {}) => {
  const errors = {};

  // ---------------------------------------------------------------------------
  // Page
  // ---------------------------------------------------------------------------

  if (
    values.page !== undefined &&
    (!Number.isInteger(Number(values.page)) || Number(values.page) < 1)
  ) {
    errors.page = "Page must be a positive integer.";
  }

  // ---------------------------------------------------------------------------
  // Limit
  // ---------------------------------------------------------------------------

  if (
    values.limit !== undefined &&
    (!Number.isInteger(Number(values.limit)) ||
      Number(values.limit) < 1 ||
      Number(values.limit) > ACCOUNT_LIMITS.MAX_LIST_LIMIT)
  ) {
    errors.limit = `Limit must be between 1 and ${ACCOUNT_LIMITS.MAX_LIST_LIMIT}.`;
  }

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  if (values.search !== undefined && typeof values.search !== "string") {
    errors.search = "Search must be a valid text value.";
  }

  if (typeof values.search === "string" && values.search.length > 100) {
    errors.search = "Maximum 100 characters allowed.";
  }

  // ---------------------------------------------------------------------------
  // Type Filter
  // ---------------------------------------------------------------------------

  if (values.type && !Object.values(ACCOUNT_TYPES).includes(values.type)) {
    errors.type = "Invalid account type.";
  }

  // ---------------------------------------------------------------------------
  // Status Filter
  // ---------------------------------------------------------------------------

  if (values.status && !Object.values(ACCOUNT_STATUS).includes(values.status)) {
    errors.status = "Invalid account status.";
  }

  return errors;
};

// =============================================================================
// Default Export
// =============================================================================

const accountValidation = Object.freeze({
  validateCreateAccount,
  validateAccountList,
});

export default accountValidation;
