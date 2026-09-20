const API_ENDPOINTS = Object.freeze({
  AUTH: Object.freeze({
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  }),

  SUBSCRIPTION_PLANS: {
    BASE: "/subscription-plans",
    BY_ID: (id) => `/subscription-plans/${id}`,
  },
  FEATURES: {
    BASE: "/features",
    BY_ID: (id) => `/features/${id}`,
  },
  PLAN_FEATURES: {
    BASE: "/plan-features",
    BY_ID: (id) => `/plan-features/${id}`,
  },
  ACCOUNTS: {
    BASE: "/accounts",
    BY_ID: (id) => `/accounts/${id}`,
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
  },
  WORKSPACES: {
    BASE: "/workspaces",
    BY_ID: (id) => `/workspaces/${id}`,
  },
});

export default API_ENDPOINTS;
