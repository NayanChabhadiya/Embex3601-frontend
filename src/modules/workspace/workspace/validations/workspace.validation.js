// =============================================================================
// Workspace Validation
// =============================================================================

import {
  WORKSPACE_TYPES,
  WORKSPACE_STATUS,
  WORKSPACE_LIMITS,
} from "../constants/workspace.constants.js";

// =============================================================================
// Common Validation Helpers
// =============================================================================

const validateRequired = (value) => {
  if (value === undefined || value === null || value === "") {
    return "This field is required.";
  }

  return "";
};

const validateStringLength = (value, min, max) => {
  if (!value) return "";

  if (value.length < min) {
    return `Minimum ${min} characters required.`;
  }

  if (value.length > max) {
    return `Maximum ${max} characters allowed.`;
  }

  return "";
};

// =============================================================================
// Field Validation
// =============================================================================

const validateName = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Workspace name is required.";
  }

  return validateStringLength(
    value.trim(),
    WORKSPACE_LIMITS.MIN_NAME_LENGTH,
    WORKSPACE_LIMITS.MAX_NAME_LENGTH,
  );
};

const validateCode = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Workspace code is required.";
  }

  const normalizedCode = value.trim();

  const lengthError = validateStringLength(
    normalizedCode,
    WORKSPACE_LIMITS.MIN_CODE_LENGTH,
    WORKSPACE_LIMITS.MAX_CODE_LENGTH,
  );

  if (lengthError) {
    return lengthError;
  }

  if (!/^[A-Z0-9_-]+$/i.test(normalizedCode)) {
    return "Workspace code contains invalid characters.";
  }

  return "";
};

const validateType = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Workspace type is required.";
  }

  if (!Object.values(WORKSPACE_TYPES).includes(value)) {
    return "Invalid workspace type.";
  }

  return "";
};

const validateDescription = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value !== "string") {
    return "Workspace description must be a valid text value.";
  }

  return validateStringLength(
    value.trim(),
    0,
    WORKSPACE_LIMITS.MAX_DESCRIPTION_LENGTH,
  );
};

// =============================================================================
// Create Workspace
// =============================================================================

export const validateCreateWorkspace = (values = {}) => {
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
// List Workspaces
// =============================================================================

export const validateWorkspaceList = (values = {}) => {
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
      Number(values.limit) > WORKSPACE_LIMITS.MAX_LIST_LIMIT)
  ) {
    errors.limit = `Limit must be between 1 and ${WORKSPACE_LIMITS.MAX_LIST_LIMIT}.`;
  }

  if (
    values.search !== undefined &&
    typeof values.search !== "string"
  ) {
    errors.search = "Search must be a valid text value.";
  }

  if (
    typeof values.search === "string" &&
    values.search.length > 100
  ) {
    errors.search = "Maximum 100 characters allowed.";
  }

  if (
    values.type &&
    !Object.values(WORKSPACE_TYPES).includes(values.type)
  ) {
    errors.type = "Invalid workspace type.";
  }

  if (
    values.status &&
    !Object.values(WORKSPACE_STATUS).includes(values.status)
  ) {
    errors.status = "Invalid workspace status.";
  }

  return errors;
};

// =============================================================================
// Export
// =============================================================================

const workspaceValidation = Object.freeze({
  validateCreateWorkspace,
  validateWorkspaceList,
});

export default workspaceValidation;