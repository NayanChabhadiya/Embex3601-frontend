// =============================================================================
// API Endpoints
// =============================================================================

const API_ENDPOINTS = Object.freeze({
  // Authentication
  AUTH: Object.freeze({
    REGISTER: "/users/register",
    VERIFY_EMAIL: "/users/verify-email",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  }),

  // Users
  USERS: Object.freeze({
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
  }),

  // Accounts
  ACCOUNT: Object.freeze({
    BASE: "/accounts",
    BY_ID: (id) => `/accounts/${id}`,
  }),

  // Subscription Plans
  SUBSCRIPTION_PLANS: Object.freeze({
    BASE: "/subscription-plans",
    AVAILABLE: "/subscription-plans/available",
  }),

  // Subscriptions
  SUBSCRIPTIONS: Object.freeze({
    BASE: "/subscriptions",
    ACTIVE: "/subscriptions/active",

    PAYMENTS: Object.freeze({
      ORDER: "/subscriptions/payments/order",
      VERIFY: "/subscriptions/payments/verify",
      PENDING: "/subscriptions/payments/pending",
      MANUAL_VERIFY: (paymentId) =>
        `/subscriptions/payments/manual/${paymentId}/verify`,
      BY_ID: (paymentId) => `/subscriptions/payments/${paymentId}`,
    }),
  }),

  // Features
  FEATURES: Object.freeze({
    BASE: "/features",
  }),

  // Plan Features
  PLAN_FEATURES: Object.freeze({
    BASE: "/plan-features",
  }),
});

export default API_ENDPOINTS;
