const API_ENDPOINTS = Object.freeze({
  AUTH: Object.freeze({
    REFRESH: "/auth/refresh",
  }),

  SUBSCRIPTION_PLANS: {
    BASE: "/subscription-plans",
    BY_ID: (id) => `/subscription-plans/${id}`,
  },
});

export default API_ENDPOINTS;
