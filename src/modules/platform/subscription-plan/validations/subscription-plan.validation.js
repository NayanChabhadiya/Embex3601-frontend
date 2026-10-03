import {
  SUBSCRIPTION_PLAN_STATUS,
  SUBSCRIPTION_PLAN_TYPES,
  SUBSCRIPTION_PLAN_BILLING_CYCLE,
  SUBSCRIPTION_PLAN_CURRENCIES,
  SUBSCRIPTION_PLAN_LIMITS,
} from "../constants/subscription-plan.constants.js";

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
// Name Validation
// --------------------------------------------------------------------------

const validateName = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Subscription plan name is required.";
  }

  return validateStringLength(
    value.trim(),
    SUBSCRIPTION_PLAN_LIMITS.MIN_NAME_LENGTH,
    SUBSCRIPTION_PLAN_LIMITS.MAX_NAME_LENGTH,
  );
};

// --------------------------------------------------------------------------
// Code Validation
// --------------------------------------------------------------------------

const validateCode = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Subscription plan code is required.";
  }

  return validateStringLength(
    value.trim(),
    SUBSCRIPTION_PLAN_LIMITS.MIN_CODE_LENGTH,
    SUBSCRIPTION_PLAN_LIMITS.MAX_CODE_LENGTH,
  );
};

// --------------------------------------------------------------------------
// Description Validation
// --------------------------------------------------------------------------

const validateDescription = (value) => {
  if (!value) {
    return "";
  }

  return validateStringLength(
    value.trim(),
    0,
    SUBSCRIPTION_PLAN_LIMITS.MAX_DESCRIPTION_LENGTH,
  );
};

// --------------------------------------------------------------------------
// Type Validation
// --------------------------------------------------------------------------

const validateType = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Subscription plan type is required.";
  }

  if (!Object.values(SUBSCRIPTION_PLAN_TYPES).includes(value)) {
    return "Invalid subscription plan type.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Billing Cycle Validation
// --------------------------------------------------------------------------

const validateBillingCycle = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Billing cycle is required.";
  }

  if (!Object.values(SUBSCRIPTION_PLAN_BILLING_CYCLE).includes(value)) {
    return "Invalid billing cycle.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Currency Validation
// --------------------------------------------------------------------------

const validateCurrency = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Currency is required.";
  }

  if (!Object.values(SUBSCRIPTION_PLAN_CURRENCIES).includes(value)) {
    return "Invalid currency.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Price Validation
// --------------------------------------------------------------------------

const validatePrice = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Price is required.";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Invalid subscription plan price.";
  }

  if (
    numericValue < SUBSCRIPTION_PLAN_LIMITS.MIN_PRICE ||
    numericValue > SUBSCRIPTION_PLAN_LIMITS.MAX_PRICE
  ) {
    return "Invalid subscription plan price.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Billing Interval Validation
// --------------------------------------------------------------------------

const validateBillingInterval = (value) => {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return "Billing interval is required.";
  }

  const numericValue = Number(value);

  if (!Number.isInteger(numericValue)) {
    return "Invalid billing interval.";
  }

  if (
    numericValue < SUBSCRIPTION_PLAN_LIMITS.MIN_BILLING_INTERVAL ||
    numericValue > SUBSCRIPTION_PLAN_LIMITS.MAX_BILLING_INTERVAL
  ) {
    return "Invalid billing interval.";
  }

  return "";
};

// --------------------------------------------------------------------------
// Create Subscription Plan Validation
// --------------------------------------------------------------------------

export const validateCreateSubscriptionPlan = (values = {}) => {
  const errors = {};

  // ------------------------------------------------------------------------
  // Name
  // ------------------------------------------------------------------------

  const nameError = validateName(values.name);

  if (nameError) {
    errors.name = nameError;
  }

  // ------------------------------------------------------------------------
  // Code
  // ------------------------------------------------------------------------

  const codeError = validateCode(values.code);

  if (codeError) {
    errors.code = codeError;
  }

  // ------------------------------------------------------------------------
  // Description
  // ------------------------------------------------------------------------

  const descriptionError = validateDescription(values.description);

  if (descriptionError) {
    errors.description = descriptionError;
  }

  // ------------------------------------------------------------------------
  // Type
  // ------------------------------------------------------------------------

  const typeError = validateType(values.type);

  if (typeError) {
    errors.type = typeError;
  }

  // ------------------------------------------------------------------------
  // Billing Cycle
  // ------------------------------------------------------------------------

  const billingCycleError = validateBillingCycle(values.billingCycle);

  if (billingCycleError) {
    errors.billingCycle = billingCycleError;
  }

  // ------------------------------------------------------------------------
  // Currency
  // ------------------------------------------------------------------------

  const currencyError = validateCurrency(values.currency);

  if (currencyError) {
    errors.currency = currencyError;
  }

  // ------------------------------------------------------------------------
  // Price
  // ------------------------------------------------------------------------

  const priceError = validatePrice(values.price);

  if (priceError) {
    errors.price = priceError;
  }

  // ------------------------------------------------------------------------
  // Billing Interval
  // ------------------------------------------------------------------------

  const billingIntervalError = validateBillingInterval(values.billingInterval);

  if (billingIntervalError) {
    errors.billingInterval = billingIntervalError;
  }

  // ------------------------------------------------------------------------
  // Status
  // ------------------------------------------------------------------------

  if (
    values.status &&
    !Object.values(SUBSCRIPTION_PLAN_STATUS).includes(values.status)
  ) {
    errors.status = "Invalid subscription plan status.";
  }

  return errors;
};

// --------------------------------------------------------------------------
// Subscription Plan List Validation
// --------------------------------------------------------------------------

export const validateSubscriptionPlanList = (values = {}) => {
  const errors = {};

  // ------------------------------------------------------------------------
  // Type Filter
  // ------------------------------------------------------------------------

  if (
    values.type &&
    !Object.values(SUBSCRIPTION_PLAN_TYPES).includes(values.type)
  ) {
    errors.type = "Invalid subscription plan type.";
  }

  // ------------------------------------------------------------------------
  // Status Filter
  // ------------------------------------------------------------------------

  if (
    values.status &&
    !Object.values(SUBSCRIPTION_PLAN_STATUS).includes(values.status)
  ) {
    errors.status = "Invalid subscription plan status.";
  }

  return errors;
};

// --------------------------------------------------------------------------
// Default Export
// --------------------------------------------------------------------------

const subscriptionPlanValidation = Object.freeze({
  validateCreateSubscriptionPlan,
  validateSubscriptionPlanList,
});

export default subscriptionPlanValidation;
