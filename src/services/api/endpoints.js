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
});

export default API_ENDPOINTS;
