const AUTHENTICATION_CONSTANTS = Object.freeze({
  TOKEN_TYPE: Object.freeze({
    ACCESS: "access",
    REFRESH: "refresh",
  }),

  AUTHENTICATION_STATUS: Object.freeze({
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
  }),

  STORAGE_KEYS: Object.freeze({
    ACCESS_TOKEN: "embex360_access_token",
    REFRESH_TOKEN: "embex360_refresh_token",
    SESSION_ID: "embex360_session_id",
    USER: "embex360_user",
  }),

  AUTH_HEADER: Object.freeze({
    PREFIX: "Bearer",
  }),

  DEFAULTS: Object.freeze({
    IS_AUTHENTICATED: false,
  }),

  USER_TYPES: Object.freeze({
    PLATFORM_ADMIN: "platform_admin",
  }),

  AUTH_STATUS: Object.freeze({
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
  }),
});

export default AUTHENTICATION_CONSTANTS;
