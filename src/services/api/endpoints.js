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
  WORKSPACE_MEMBERSHIPS: {
    BASE: "/workspace-memberships",
    BY_ID: (id) => `/workspace-memberships/${id}`,
  },
  WORKSPACE_SUBSCRIPTIONS: {
    BASE: "/workspace-subscriptions",
    BY_ID: (id) => `/workspace-subscriptions/${id}`,
  },
  UNITS: {
    BASE: "/units",
    BY_ID: (id) => `/units/${id}`,
  },
  TAXES: {
    BASE: "/taxes",
    BY_ID: (id) => `/taxes/${id}`,
  },
  CURRENCIES: {
    BASE: "/currencies",
    BY_ID: (id) => `/currencies/${id}`,
  },
  PAYMENT_TERMS: {
    BASE: "/payment-terms",
    BY_ID: (id) => `/payment-terms/${id}`,
  },
  BANKS: {
    BASE: "/banks",
    BY_ID: (id) => `/banks/${id}`,
  },
  HSN_SAC: {
    BASE: "/hsn-sac",
    BY_ID: (id) => `/hsn-sac/${id}`,
  },
  PARTNER_CATEGORIES: {
    BASE: "/partner-categories",
    BY_ID: (id) => `/partner-categories/${id}`,
  },
  PRODUCT_CATEGORIES: {
    BASE: "/product-categories",
    BY_ID: (id) => `/product-categories/${id}`,
  },
  ITEMS: {
    BASE: "/items",
    BY_ID: (id) => `/items/${id}`,
  },
});

export default API_ENDPOINTS;
