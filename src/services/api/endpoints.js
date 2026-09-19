const API_ENDPOINTS = Object.freeze({
  AUTH: Object.freeze({
    REFRESH: "/auth/refresh",
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
});

export default API_ENDPOINTS;
