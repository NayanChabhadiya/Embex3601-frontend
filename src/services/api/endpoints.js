const API_ENDPOINTS = Object.freeze({
  AUTH: Object.freeze({
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
  }),

  PLATFORM_ADMIN: Object.freeze({
    ACCESS: "/platform-admin/access",
  }),

  FEATURES: Object.freeze({
    LIST: "/features",
    CREATE: "/features",
    BY_ID: (id) => `/features/${id}`,
    ACTIVATE: (id) => `/features/${id}/activate`,
    DEACTIVATE: (id) => `/features/${id}/deactivate`,
    RESTORE: (id) => `/features/${id}/restore`,
  }),

  SUBSCRIPTION_PLANS: Object.freeze({
    LIST: "/subscription-plans",
    ACTIVE: "/subscription-plans/active",
    BY_ID: (id) => `/subscription-plans/${id}`,
    CREATE: "/subscription-plans",
    UPDATE: (id) => `/subscription-plans/${id}`,
    ACTIVATE: (id) => `/subscription-plans/${id}/activate`,
    DEACTIVATE: (id) => `/subscription-plans/${id}/deactivate`,
    DELETE: (id) => `/subscription-plans/${id}`,
    RESTORE: (id) => `/subscription-plans/${id}/restore`,
  }),

  PLAN_FEATURES: Object.freeze({
    LIST: (subscriptionPlanId) =>
      `/subscription-plans/${subscriptionPlanId}/features`,
    CREATE: (subscriptionPlanId) =>
      `/subscription-plans/${subscriptionPlanId}/features`,
    BY_FEATURE_ID: (subscriptionPlanId, featureId) =>
      `/subscription-plans/${subscriptionPlanId}/features/${featureId}`,
    UPDATE: (subscriptionPlanId, featureId) =>
      `/subscription-plans/${subscriptionPlanId}/features/${featureId}`,
    DELETE: (subscriptionPlanId, featureId) =>
      `/subscription-plans/${subscriptionPlanId}/features/${featureId}`,
  }),
});

export default API_ENDPOINTS;
