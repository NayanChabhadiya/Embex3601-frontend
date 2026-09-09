const APP_ROUTES = Object.freeze({
  PUBLIC: Object.freeze({ LOGIN: "/login" }),
  PROTECTED: Object.freeze({ ROOT: "/", DASHBOARD: "/dashboard" }),

  PLATFORM_ADMIN: Object.freeze({
    ROOT: "/platform",
    DASHBOARD: "/platform/dashboard",
  }),

  FALLBACK: "/",
});

export default APP_ROUTES;
