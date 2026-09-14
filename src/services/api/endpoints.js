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
});

export default API_ENDPOINTS;
