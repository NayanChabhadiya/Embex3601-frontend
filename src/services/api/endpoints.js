const API_ENDPOINTS = Object.freeze({
  AUTH: Object.freeze({
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    CURRENT_USER: "/auth/me",
  }),
});

export default API_ENDPOINTS;
