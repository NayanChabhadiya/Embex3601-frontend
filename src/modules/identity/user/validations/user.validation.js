import {
  USER_STATUS,
  USER_TYPE,
  USER_VERIFICATION_STATUS,
} from "../constants/user.constants.js";

// --------------------------------------------------------------------------
// Common Validation Rules
// --------------------------------------------------------------------------

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

// --------------------------------------------------------------------------
// Email Validation
// --------------------------------------------------------------------------

const validateEmail = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return requiredError;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return "Please enter a valid email address.";
  }

  if (value.length > 255) {
    return "Maximum 255 characters allowed.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Mobile Validation
// --------------------------------------------------------------------------

const validateMobile = (value) => {
  if (!value) {
    return "";
  }

  if (value.length < 7 || value.length > 20) {
    return "Please enter a valid mobile number.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Password Validation
// --------------------------------------------------------------------------

const validatePassword = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return requiredError;
  }

  return validateStringLength(value, 8, 128);
};

// --------------------------------------------------------------------------
// Create User Validation
// --------------------------------------------------------------------------

export const validateCreateUser = (values = {}) => {
  const errors = {};

  // ------------------------------------------------------------------------
  // First Name
  // ------------------------------------------------------------------------

  const firstNameRequired = validateRequired(values.firstName);

  if (firstNameRequired) {
    errors.firstName = "First name is required.";
  } else {
    const error = validateStringLength(values.firstName.trim(), 2, 100);

    if (error) {
      errors.firstName = error;
    }
  }

  // ------------------------------------------------------------------------
  // Last Name
  // ------------------------------------------------------------------------

  const lastNameRequired = validateRequired(values.lastName);

  if (lastNameRequired) {
    errors.lastName = "Last name is required.";
  } else {
    const error = validateStringLength(values.lastName.trim(), 1, 100);

    if (error) {
      errors.lastName = error;
    }
  }

  // ------------------------------------------------------------------------
  // Display Name
  // ------------------------------------------------------------------------

  if (values.displayName) {
    const error = validateStringLength(values.displayName.trim(), 0, 201);

    if (error) {
      errors.displayName = error;
    }
  }

  // ------------------------------------------------------------------------
  // Email
  // ------------------------------------------------------------------------

  const emailError = validateEmail(values.email);

  if (emailError) {
    errors.email = emailError;
  }

  // ------------------------------------------------------------------------
  // Mobile
  // ------------------------------------------------------------------------

  const mobileError = validateMobile(values.mobile);

  if (mobileError) {
    errors.mobile = mobileError;
  }

  // ------------------------------------------------------------------------
  // Password
  // ------------------------------------------------------------------------

  const passwordError = validatePassword(values.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  // ------------------------------------------------------------------------
  // User Type
  // ------------------------------------------------------------------------

  if (!Object.values(USER_TYPE).includes(values.type)) {
    errors.type = "Please select a valid user type.";
  }

  // ------------------------------------------------------------------------
  // Status
  // ------------------------------------------------------------------------

  if (values.status && !Object.values(USER_STATUS).includes(values.status)) {
    errors.status = "Please select a valid user status.";
  }

  // ------------------------------------------------------------------------
  // Verification Status
  // ------------------------------------------------------------------------

  if (
    values.verificationStatus &&
    !Object.values(USER_VERIFICATION_STATUS).includes(values.verificationStatus)
  ) {
    errors.verificationStatus = "Please select a valid verification status.";
  }

  return errors;
};

// --------------------------------------------------------------------------
// User ID Validation
// --------------------------------------------------------------------------

export const validateUserId = (id) => {
  if (!id) {
    return "Invalid user ID.";
  }

  const objectIdRegex = /^[a-fA-F0-9]{24}$/;

  if (!objectIdRegex.test(id)) {
    return "Invalid user ID.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Default Export
// --------------------------------------------------------------------------

const userValidation = Object.freeze({
  validateCreateUser,
  validateUserId,
});

export default userValidation;
