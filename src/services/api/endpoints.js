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
});

export default API_ENDPOINTS;
