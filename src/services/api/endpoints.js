const API_ENDPOINTS = Object.freeze({
  // Authentication
  AUTH: Object.freeze({
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
  ACCOUNTS: Object.freeze({
    BASE: "/accounts",
    BY_ID: (id) => `/accounts/${id}`,
  }),

  // Subscription Plans
  SUBSCRIPTION_PLANS: Object.freeze({
    BASE: "/subscription-plans",
  }),

  // Fratures
  FEATURES: Object.freeze({
    BASE: "/features",
  }),

  // Plan Features
  PLAN_FEATURES: Object.freeze({
    BASE: "/plan-features",
  }),
});

export default API_ENDPOINTS;
