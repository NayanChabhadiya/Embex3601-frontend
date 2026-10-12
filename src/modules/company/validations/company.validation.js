// =============================================================================
// Company Validation
// =============================================================================

import {
  COMPANY_TYPES,
  COMPANY_STATUS,
  COMPANY_LIMITS,
} from "../constants/company.constants.js";

import COMPANY_MESSAGES from "../constants/company.messages.js";

// =============================================================================
// Common Validation Helpers
// =============================================================================

const validateRequired = (value) => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return "This field is required.";
  }

  return "";
};

const validateStringLength = (value, min, max) => {
  if (!value) return "";

  if (typeof value !== "string") {
    return "This field must be a valid text value.";
  }

  if (value.trim().length < min) {
    return `Minimum ${min} characters required.`;
  }

  if (value.trim().length > max) {
    return `Maximum ${max} characters allowed.`;
  }

  return "";
};

// =============================================================================
// Field Validation
// =============================================================================

const validateName = (value) => {
  if (validateRequired(value)) {
    return COMPANY_MESSAGES.NAME_REQUIRED;
  }

  return validateStringLength(
    value,
    COMPANY_LIMITS.MIN_NAME_LENGTH,
    COMPANY_LIMITS.MAX_NAME_LENGTH,
  );
};

const validateCode = (value) => {
  if (validateRequired(value)) {
    return COMPANY_MESSAGES.CODE_REQUIRED;
  }

  const normalizedCode = value.trim().toUpperCase();

  const lengthError = validateStringLength(
    normalizedCode,
    COMPANY_LIMITS.MIN_CODE_LENGTH,
    COMPANY_LIMITS.MAX_CODE_LENGTH,
  );

  if (lengthError) return lengthError;

  if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(normalizedCode)) {
    return "Company code contains invalid characters.";
  }

  return "";
};

const validateLegalName = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return validateStringLength(value, 1, COMPANY_LIMITS.MAX_LEGAL_NAME_LENGTH);
};

const validateType = (value) => {
  if (validateRequired(value)) {
    return "Company type is required.";
  }

  if (!Object.values(COMPANY_TYPES).includes(value)) {
    return COMPANY_MESSAGES.INVALID_TYPE;
  }

  return "";
};

const validateDescription = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return validateStringLength(value, 0, COMPANY_LIMITS.MAX_DESCRIPTION_LENGTH);
};

const validateGSTIN = (value) => {
  if (!value) return "";

  const normalizedValue = value.trim().toUpperCase();

  if (normalizedValue.length !== COMPANY_LIMITS.MAX_GSTIN_LENGTH) {
    return COMPANY_MESSAGES.INVALID_GSTIN;
  }

  if (
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(normalizedValue)
  ) {
    return COMPANY_MESSAGES.INVALID_GSTIN;
  }

  return "";
};

const validatePAN = (value) => {
  if (!value) return "";

  const normalizedValue = value.trim().toUpperCase();

  if (
    normalizedValue.length !== COMPANY_LIMITS.MAX_PAN_LENGTH ||
    !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedValue)
  ) {
    return COMPANY_MESSAGES.INVALID_PAN;
  }

  return "";
};

const validateCIN = (value) => {
  if (!value) return "";

  const normalizedValue = value.trim().toUpperCase();

  if (
    normalizedValue.length !== COMPANY_LIMITS.MAX_CIN_LENGTH ||
    !/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(normalizedValue)
  ) {
    return COMPANY_MESSAGES.INVALID_CIN;
  }

  return "";
};

const validateEmail = (value) => {
  if (!value) return "";

  if (
    typeof value !== "string" ||
    value.length > COMPANY_LIMITS.MAX_EMAIL_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  ) {
    return COMPANY_MESSAGES.INVALID_EMAIL;
  }

  return "";
};

const validateOptionalString = (value, maxLength, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value !== "string") {
    return `${fieldName} must be a valid text value.`;
  }

  if (value.trim().length > maxLength) {
    return `Maximum ${maxLength} characters allowed.`;
  }

  return "";
};

// =============================================================================
// Create Company
// =============================================================================

export const validateCreateCompany = (values = {}) => {
  const errors = {};

  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;

  const codeError = validateCode(values.code);
  if (codeError) errors.code = codeError;

  const typeError = validateType(values.type);
  if (typeError) errors.type = typeError;

  const legalNameError = validateLegalName(values.legalName);
  if (legalNameError) errors.legalName = legalNameError;

  const descriptionError = validateDescription(values.description);
  if (descriptionError) errors.description = descriptionError;

  const gstinError = validateGSTIN(values.gstin);
  if (gstinError) errors.gstin = gstinError;

  const panError = validatePAN(values.pan);
  if (panError) errors.pan = panError;

  const cinError = validateCIN(values.cin);
  if (cinError) errors.cin = cinError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const phoneError = validateOptionalString(
    values.phone,
    COMPANY_LIMITS.MAX_PHONE_LENGTH,
    "Phone",
  );
  if (phoneError) errors.phone = phoneError;

  const addressError = validateOptionalString(
    values.address,
    COMPANY_LIMITS.MAX_ADDRESS_LENGTH,
    "Address",
  );
  if (addressError) errors.address = addressError;

  const cityError = validateOptionalString(values.city, 100, "City");
  if (cityError) errors.city = cityError;

  const stateError = validateOptionalString(values.state, 100, "State");
  if (stateError) errors.state = stateError;

  const countryError = validateOptionalString(values.country, 100, "Country");
  if (countryError) errors.country = countryError;

  const pincodeError = validateOptionalString(
    values.pincode,
    COMPANY_LIMITS.MAX_PINCODE_LENGTH,
    "Pincode",
  );
  if (pincodeError) errors.pincode = pincodeError;

  return errors;
};

// =============================================================================
// List Companies
// =============================================================================

export const validateCompanyList = (values = {}) => {
  const errors = {};

  if (
    values.page !== undefined &&
    (!Number.isInteger(Number(values.page)) || Number(values.page) < 1)
  ) {
    errors.page = "Page must be a positive integer.";
  }

  if (
    values.limit !== undefined &&
    (!Number.isInteger(Number(values.limit)) ||
      Number(values.limit) < 1 ||
      Number(values.limit) > COMPANY_LIMITS.MAX_LIST_LIMIT)
  ) {
    errors.limit = `Limit must be between 1 and ${COMPANY_LIMITS.MAX_LIST_LIMIT}.`;
  }

  if (values.search !== undefined && typeof values.search !== "string") {
    errors.search = "Search must be a valid text value.";
  }

  if (typeof values.search === "string" && values.search.length > 100) {
    errors.search = "Maximum 100 characters allowed.";
  }

  if (values.type && !Object.values(COMPANY_TYPES).includes(values.type)) {
    errors.type = COMPANY_MESSAGES.INVALID_TYPE;
  }

  if (values.status && !Object.values(COMPANY_STATUS).includes(values.status)) {
    errors.status = COMPANY_MESSAGES.INVALID_STATUS;
  }

  return errors;
};

// =============================================================================
// Export
// =============================================================================

const companyValidation = Object.freeze({
  validateCreateCompany,
  validateCompanyList,
});

export default companyValidation;
