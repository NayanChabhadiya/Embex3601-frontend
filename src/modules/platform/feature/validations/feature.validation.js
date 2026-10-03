// =============================================================================
// Feature Validation
// =============================================================================

import {
  FEATURE_TYPES,
  FEATURE_LIMITS,
} from "../constants/feature.constants.js";

// -----------------------------------------------------------------------------
// Required Validation
// -----------------------------------------------------------------------------

const validateRequired = (value) => {
  if (value === undefined || value === null || value === "") {
    return "This field is required.";
  }

  return "";
};

// -----------------------------------------------------------------------------
// String Length Validation
// -----------------------------------------------------------------------------

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
    return "Feature name is required.";
  }

  return validateStringLength(
    value.trim(),
    FEATURE_LIMITS.MIN_NAME_LENGTH,
    FEATURE_LIMITS.MAX_NAME_LENGTH,
  );
};

// -----------------------------------------------------------------------------
// Code Validation
// -----------------------------------------------------------------------------

const validateCode = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Feature code is required.";
  }

  const normalizedCode = value.trim();

  const lengthError = validateStringLength(
    normalizedCode,
    FEATURE_LIMITS.MIN_CODE_LENGTH,
    FEATURE_LIMITS.MAX_CODE_LENGTH,
  );

  if (lengthError) {
    return lengthError;
  }

  if (!/^[A-Z0-9_-]+$/i.test(normalizedCode)) {
    return "Feature code contains invalid characters.";
  }

  return "";
};

// -----------------------------------------------------------------------------
// Type Validation
// -----------------------------------------------------------------------------

const validateType = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Feature type is required.";
  }

  if (!Object.values(FEATURE_TYPES).includes(value)) {
    return "Invalid feature type.";
  }

  return "";
};

// -----------------------------------------------------------------------------
// Description Validation
// -----------------------------------------------------------------------------

const validateDescription = (value) => {
  if (!value) {
    return "";
  }

  return validateStringLength(
    value.trim(),
    0,
    FEATURE_LIMITS.MAX_DESCRIPTION_LENGTH,
  );
};

// =============================================================================
// Create Feature Validation
// =============================================================================

export const validateCreateFeature = (values = {}) => {
  const errors = {};

  const nameError = validateName(values.name);

  if (nameError) {
    errors.name = nameError;
  }

  const codeError = validateCode(values.code);

  if (codeError) {
    errors.code = codeError;
  }

  const typeError = validateType(values.type);

  if (typeError) {
    errors.type = typeError;
  }

  const descriptionError = validateDescription(values.description);

  if (descriptionError) {
    errors.description = descriptionError;
  }

  return errors;
};

// =============================================================================
// Feature List Validation
// =============================================================================

export const validateFeatureList = (values = {}) => {
  const errors = {};

  if (values.type && !Object.values(FEATURE_TYPES).includes(values.type)) {
    errors.type = "Invalid feature type.";
  }

  return errors;
};

// =============================================================================
// Default Validation Object
// =============================================================================

const featureValidation = Object.freeze({
  validateCreateFeature,
  validateFeatureList,
});

export default featureValidation;
