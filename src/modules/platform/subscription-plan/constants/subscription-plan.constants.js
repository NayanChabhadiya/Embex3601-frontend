// =============================================================================
// Subscription Plan Constants
// =============================================================================

const SUBSCRIPTION_PLAN_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

const SUBSCRIPTION_PLAN_TYPES = Object.freeze({
  FREE: "free",
  TRIAL: "trial",
  PAID: "paid",
  ENTERPRISE: "enterprise",
});

const SUBSCRIPTION_PLAN_BILLING_CYCLE = Object.freeze({
  MONTHLY: "monthly",
  YEARLY: "yearly",
  ONE_TIME: "one_time",
});

const SUBSCRIPTION_PLAN_CURRENCIES = Object.freeze({
  INR: "INR",
  USD: "USD",
});

const SUBSCRIPTION_PLAN_LIMITS = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,

  MIN_CODE_LENGTH: 2,
  MAX_CODE_LENGTH: 50,

  MAX_DESCRIPTION_LENGTH: 500,

  MIN_PRICE: 0,
  MAX_PRICE: 999999999,

  MIN_BILLING_INTERVAL: 1,
  MAX_BILLING_INTERVAL: 120,
});

const SUBSCRIPTION_PLAN_CONSTANTS = Object.freeze({
  STATUS: SUBSCRIPTION_PLAN_STATUS,
  TYPES: SUBSCRIPTION_PLAN_TYPES,
  BILLING_CYCLE: SUBSCRIPTION_PLAN_BILLING_CYCLE,
  CURRENCIES: SUBSCRIPTION_PLAN_CURRENCIES,
  LIMITS: SUBSCRIPTION_PLAN_LIMITS,
});

export {
  SUBSCRIPTION_PLAN_STATUS,
  SUBSCRIPTION_PLAN_TYPES,
  SUBSCRIPTION_PLAN_BILLING_CYCLE,
  SUBSCRIPTION_PLAN_CURRENCIES,
  SUBSCRIPTION_PLAN_LIMITS,
};

export default SUBSCRIPTION_PLAN_CONSTANTS;
