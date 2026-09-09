const AUTH_STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  FAILED: "failed",
});

const AUTH_PROVIDER = Object.freeze({
  PASSWORD: "password",
});

const AUTH_MESSAGES = Object.freeze({
  LOGIN_SUCCESS: "Login successful.",
  LOGIN_FAILED: "Unable to sign in. Please check your credentials.",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  SESSION_RESTORED: "Your session has been restored.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  NETWORK_ERROR: "Unable to connect to the server. Please try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
});

const AUTH_ERROR_CODES = Object.freeze({
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
});

const AUTH_EVENTS = Object.freeze({
  LOGIN: "auth:login",
  LOGOUT: "auth:logout",
  SESSION_EXPIRED: "auth:session-expired",
});

export {
  AUTH_STATUS,
  AUTH_PROVIDER,
  AUTH_MESSAGES,
  AUTH_ERROR_CODES,
  AUTH_EVENTS,
};
