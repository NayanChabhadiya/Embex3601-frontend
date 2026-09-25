const AUTH_MESSAGES = Object.freeze({
  // Login
  LOGIN_SUCCESS: "Login successful.",
  LOGIN_FAILED: "Login failed.",
  INVALID_CREDENTIALS: "Invalid email or password.",

  EMAIL_REQUIRED: "Email is required.",
  INVALID_EMAIL: "Invalid email address.",
  PASSWORD_REQUIRED: "Password is required.",

  // Authentication
  AUTHENTICATION_REQUIRED: "Authentication is required.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
  ACCESS_TOKEN_EXPIRED: "Your session has expired. Please login again.",
  INVALID_ACCESS_TOKEN: "Invalid access token.",

  // Refresh Token
  REFRESH_FAILED: "Unable to refresh your session.",
  REFRESH_TOKEN_EXPIRED: "Your session has expired. Please login again.",
  INVALID_REFRESH_TOKEN: "Invalid refresh token.",

  // Current User
  CURRENT_USER_FETCH_FAILED: "Unable to fetch current user.",

  // Logout
  LOGOUT_SUCCESS: "Logout successful.",
  LOGOUT_FAILED: "Logout failed.",
});

export default AUTH_MESSAGES;
