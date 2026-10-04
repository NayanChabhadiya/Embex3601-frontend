import AUTHENTICATION_MESSAGES from "../constants/authentication.messages.js";

const validateLogin = (values = {}) => {
  const errors = {};

  const email = values.email?.trim() ?? "";
  const password = values.password ?? "";

  // Email
  if (!email) {
    errors.email = AUTHENTICATION_MESSAGES.EMAIL_REQUIRED;
  } else if (email.length > 255) {
    errors.email = AUTHENTICATION_MESSAGES.EMAIL_MAX_LENGTH;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = AUTHENTICATION_MESSAGES.INVALID_EMAIL;
  }

  // Password
  if (!password) {
    errors.password = AUTHENTICATION_MESSAGES.PASSWORD_REQUIRED;
  }

  return errors;
};

const isLoginValid = (values = {}) => {
  return Object.keys(validateLogin(values)).length === 0;
};

/* =========================================================
   REGISTER VALIDATION
========================================================= */

const validateRegister = (values = {}) => {
  const errors = {};

  const firstName = values.firstName?.trim() ?? "";
  const lastName = values.lastName?.trim() ?? "";
  const email = values.email?.trim() ?? "";
  const mobile = values.mobile?.trim() ?? "";
  const password = values.password ?? "";
  const confirmPassword = values.confirmPassword ?? "";

  // First Name
  if (!firstName) {
    errors.firstName = "First name is required.";
  } else if (firstName.length > 100) {
    errors.firstName = "First name must not exceed 100 characters.";
  }

  // Last Name
  if (!lastName) {
    errors.lastName = "Last name is required.";
  } else if (lastName.length > 100) {
    errors.lastName = "Last name must not exceed 100 characters.";
  }

  // Email
  if (!email) {
    errors.email = AUTHENTICATION_MESSAGES.EMAIL_REQUIRED;
  } else if (email.length > 255) {
    errors.email = AUTHENTICATION_MESSAGES.EMAIL_MAX_LENGTH;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = AUTHENTICATION_MESSAGES.INVALID_EMAIL;
  }

  // Mobile
  if (!mobile) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^[0-9]{10}$/.test(mobile)) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  // Password
  if (!password) {
    errors.password = AUTHENTICATION_MESSAGES.PASSWORD_REQUIRED;
  }

  // Confirm Password
  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

const isRegisterValid = (values = {}) => {
  return Object.keys(validateRegister(values)).length === 0;
};

const AUTHENTICATION_VALIDATION = Object.freeze({
  validateLogin,
  isLoginValid,
  validateRegister,
  isRegisterValid,
});

export default AUTHENTICATION_VALIDATION;
