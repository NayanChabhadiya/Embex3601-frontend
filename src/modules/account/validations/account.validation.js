// =============================================================================
// Account Validation
// =============================================================================

import {
  ACCOUNT_STATUS,
  ACCOUNT_TYPES,
  ACCOUNT_VERIFICATION_STATUS,
  ACCOUNT_PLAN_STATUS,
  ACCOUNT_LIMITS,
  ACCOUNT_IMMUTABLE_FIELDS,
  ACCOUNT_EDITABLE_FIELDS,
} from "../constants/account.constants.js";

// =============================================================================
// Helpers
// =============================================================================

const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object, key);

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

const normalizeNullableString = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim();

  return normalized === "" ? null : normalized;
};

const isValidObjectId = (value) =>
  typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);

const isValidEmail = (value) =>
  typeof value === "string" &&
  value.length <= ACCOUNT_LIMITS.MAX_EMAIL_LENGTH &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value) =>
  typeof value === "string" &&
  value.length <= ACCOUNT_LIMITS.MAX_PHONE_LENGTH &&
  /^\+?[0-9\s().-]+$/.test(value);

const isValidSlug = (value) =>
  typeof value === "string" &&
  value.length >= ACCOUNT_LIMITS.MIN_SLUG_LENGTH &&
  value.length <= ACCOUNT_LIMITS.MAX_SLUG_LENGTH &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const isAllowedEnumValue = (value, source) =>
  Object.values(source).includes(value);

const sanitizePayload = (payload) => {
  const sanitized = {};

  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value === "string") {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

const rejectUnknownFields = (payload, allowedFields) => {
  const allowed = new Set(allowedFields);

  return Object.keys(payload).filter((field) => !allowed.has(field));
};

const rejectImmutableFields = (payload) =>
  ACCOUNT_IMMUTABLE_FIELDS.filter((field) => hasOwn(payload, field));

// =============================================================================
// Create Account Validation
// =============================================================================

const createAccountValidation = (req, res, next) => {
  try {
    if (!isPlainObject(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account payload.",
      });
    }

    const sanitized = sanitizePayload(req.body);

    const allowedFields = [
      "name",
      "slug",
      "type",
      "description",
      "email",
      "phone",
    ];

    const unsupportedFields = rejectUnknownFields(sanitized, allowedFields);

    if (unsupportedFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Request contains unsupported fields.",
        fields: unsupportedFields,
      });
    }

    const errors = [];

    // -------------------------------------------------------------------------
    // Name
    // -------------------------------------------------------------------------

    if (
      typeof sanitized.name !== "string" ||
      sanitized.name.length < ACCOUNT_LIMITS.MIN_NAME_LENGTH ||
      sanitized.name.length > ACCOUNT_LIMITS.MAX_NAME_LENGTH
    ) {
      errors.push({
        field: "name",
        message: "Name must be between 2 and 150 characters.",
      });
    }

    // -------------------------------------------------------------------------
    // Slug
    // -------------------------------------------------------------------------

    if (!isValidSlug(sanitized.slug)) {
      errors.push({
        field: "slug",
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      });
    }

    // -------------------------------------------------------------------------
    // Type
    // -------------------------------------------------------------------------

    if (
      sanitized.type !== undefined &&
      !isAllowedEnumValue(sanitized.type, ACCOUNT_TYPES)
    ) {
      errors.push({
        field: "type",
        message: "Invalid account type.",
      });
    }

    // -------------------------------------------------------------------------
    // Description
    // -------------------------------------------------------------------------

    if (
      sanitized.description !== undefined &&
      sanitized.description !== null &&
      (typeof sanitized.description !== "string" ||
        sanitized.description.length > ACCOUNT_LIMITS.MAX_DESCRIPTION_LENGTH)
    ) {
      errors.push({
        field: "description",
        message: "Description cannot exceed 500 characters.",
      });
    }

    // -------------------------------------------------------------------------
    // Email
    // -------------------------------------------------------------------------

    if (
      sanitized.email !== undefined &&
      sanitized.email !== null &&
      !isValidEmail(sanitized.email)
    ) {
      errors.push({
        field: "email",
        message: "Invalid email address.",
      });
    }

    // -------------------------------------------------------------------------
    // Phone
    // -------------------------------------------------------------------------

    if (
      sanitized.phone !== undefined &&
      sanitized.phone !== null &&
      !isValidPhone(sanitized.phone)
    ) {
      errors.push({
        field: "phone",
        message: "Invalid phone number.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Account validation failed.",
        errors,
      });
    }

    req.body = {
      ...sanitized,
      name: normalizeString(sanitized.name),
      slug: normalizeString(sanitized.slug)?.toLowerCase(),
      description: normalizeNullableString(sanitized.description),
      email: normalizeNullableString(sanitized.email)?.toLowerCase(),
      phone: normalizeNullableString(sanitized.phone),
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

const validateCreateAccount = (values) => {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Account name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Account name must be at least 2 characters.";
  } else if (values.name.trim().length > 150) {
    errors.name = "Account name cannot exceed 150 characters.";
  }

  if (!values.slug?.trim()) {
    errors.slug = "Account slug is required.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug.trim())) {
    errors.slug =
      "Slug must contain only lowercase letters, numbers, and hyphens.";
  }

  if (
    values.type !== undefined &&
    values.type !== null &&
    !["individual", "business", "enterprise"].includes(values.type)
  ) {
    errors.type = "Invalid account type.";
  }

  if (values.description && values.description.trim().length > 500) {
    errors.description = "Description cannot exceed 500 characters.";
  }

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Invalid email address.";
  }

  if (values.phone && !/^[+]?[\d\s().-]{7,30}$/.test(values.phone.trim())) {
    errors.phone = "Invalid phone number.";
  }

  return errors;
};

// =============================================================================
// List Accounts Validation
// =============================================================================

const listAccountsValidation = (req, res, next) => {
  try {
    const {
      page = ACCOUNT_LIMITS.DEFAULT_PAGE,
      limit = ACCOUNT_LIMITS.DEFAULT_LIMIT,
      status,
      type,
      verificationStatus,
      planStatus,
    } = req.query;

    const normalizedPage = Number(page);
    const normalizedLimit = Number(limit);

    const errors = [];

    if (!Number.isInteger(normalizedPage) || normalizedPage < 1) {
      errors.push({
        field: "page",
        message: "Page must be a positive integer.",
      });
    }

    if (
      !Number.isInteger(normalizedLimit) ||
      normalizedLimit < ACCOUNT_LIMITS.MIN_LIMIT ||
      normalizedLimit > ACCOUNT_LIMITS.MAX_LIMIT
    ) {
      errors.push({
        field: "limit",
        message: "Limit must be between 1 and 100.",
      });
    }

    if (status !== undefined && !isAllowedEnumValue(status, ACCOUNT_STATUS)) {
      errors.push({
        field: "status",
        message: "Invalid account status.",
      });
    }

    if (type !== undefined && !isAllowedEnumValue(type, ACCOUNT_TYPES)) {
      errors.push({
        field: "type",
        message: "Invalid account type.",
      });
    }

    if (
      verificationStatus !== undefined &&
      !isAllowedEnumValue(verificationStatus, ACCOUNT_VERIFICATION_STATUS)
    ) {
      errors.push({
        field: "verificationStatus",
        message: "Invalid account verification status.",
      });
    }

    if (
      planStatus !== undefined &&
      !isAllowedEnumValue(planStatus, ACCOUNT_PLAN_STATUS)
    ) {
      errors.push({
        field: "planStatus",
        message: "Invalid account plan status.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Account filter validation failed.",
        errors,
      });
    }

    req.query.page = normalizedPage;
    req.query.limit = normalizedLimit;

    return next();
  } catch (error) {
    return next(error);
  }
};

// =============================================================================
// Get Account By ID Validation
// =============================================================================

const getAccountByIdValidation = (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID.",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

// =============================================================================
// Update Account Validation
// =============================================================================

const updateAccountValidation = (req, res, next) => {
  try {
    if (!isPlainObject(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account update payload.",
      });
    }

    const sanitized = sanitizePayload(req.body);

    const unsupportedFields = rejectUnknownFields(
      sanitized,
      ACCOUNT_EDITABLE_FIELDS,
    );

    if (unsupportedFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Request contains unsupported fields.",
        fields: unsupportedFields,
      });
    }

    const immutableFields = rejectImmutableFields(sanitized);

    if (immutableFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more fields cannot be modified.",
        fields: immutableFields,
      });
    }

    const keys = Object.keys(sanitized);

    if (keys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields were provided for update.",
      });
    }

    const errors = [];

    // -------------------------------------------------------------------------
    // Name
    // -------------------------------------------------------------------------

    if (hasOwn(sanitized, "name")) {
      if (
        typeof sanitized.name !== "string" ||
        sanitized.name.length < ACCOUNT_LIMITS.MIN_NAME_LENGTH ||
        sanitized.name.length > ACCOUNT_LIMITS.MAX_NAME_LENGTH
      ) {
        errors.push({
          field: "name",
          message: "Name must be between 2 and 150 characters.",
        });
      }
    }

    // -------------------------------------------------------------------------
    // Slug
    // -------------------------------------------------------------------------

    if (hasOwn(sanitized, "slug") && !isValidSlug(sanitized.slug)) {
      errors.push({
        field: "slug",
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      });
    }

    // -------------------------------------------------------------------------
    // Type
    // -------------------------------------------------------------------------

    if (
      hasOwn(sanitized, "type") &&
      !isAllowedEnumValue(sanitized.type, ACCOUNT_TYPES)
    ) {
      errors.push({
        field: "type",
        message: "Invalid account type.",
      });
    }

    // -------------------------------------------------------------------------
    // Description
    // -------------------------------------------------------------------------

    if (
      hasOwn(sanitized, "description") &&
      sanitized.description !== null &&
      (typeof sanitized.description !== "string" ||
        sanitized.description.length > ACCOUNT_LIMITS.MAX_DESCRIPTION_LENGTH)
    ) {
      errors.push({
        field: "description",
        message: "Description cannot exceed 500 characters.",
      });
    }

    // -------------------------------------------------------------------------
    // Email
    // -------------------------------------------------------------------------

    if (
      hasOwn(sanitized, "email") &&
      sanitized.email !== null &&
      !isValidEmail(sanitized.email)
    ) {
      errors.push({
        field: "email",
        message: "Invalid email address.",
      });
    }

    // -------------------------------------------------------------------------
    // Phone
    // -------------------------------------------------------------------------

    if (
      hasOwn(sanitized, "phone") &&
      sanitized.phone !== null &&
      !isValidPhone(sanitized.phone)
    ) {
      errors.push({
        field: "phone",
        message: "Invalid phone number.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Account validation failed.",
        errors,
      });
    }

    req.body = {
      ...sanitized,

      ...(hasOwn(sanitized, "name") && {
        name: normalizeString(sanitized.name),
      }),

      ...(hasOwn(sanitized, "slug") && {
        slug: normalizeString(sanitized.slug)?.toLowerCase(),
      }),

      ...(hasOwn(sanitized, "description") && {
        description: normalizeNullableString(sanitized.description),
      }),

      ...(hasOwn(sanitized, "email") && {
        email: normalizeNullableString(sanitized.email)?.toLowerCase(),
      }),

      ...(hasOwn(sanitized, "phone") && {
        phone: normalizeNullableString(sanitized.phone),
      }),
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

// =============================================================================
// Delete Account Validation
// =============================================================================

const deleteAccountValidation = (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID.",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

// =============================================================================
// Export
// =============================================================================

const accountValidation = Object.freeze({
  createAccountValidation,
  validateCreateAccount,
  listAccountsValidation,
  getAccountByIdValidation,
  updateAccountValidation,
  deleteAccountValidation,
});

export {
  createAccountValidation,
  validateCreateAccount,
  listAccountsValidation,
  getAccountByIdValidation,
  updateAccountValidation,
  deleteAccountValidation,
};

export default accountValidation;
