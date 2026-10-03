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
  } else if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email)) {
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

const AUTHENTICATION_VALIDATION = Object.freeze({
  validateLogin,
  isLoginValid,
});

export default AUTHENTICATION_VALIDATION;
