const AUTH_MESSAGES = Object.freeze({
  // Registration
  REGISTRATION_SUCCESS:
    "Registration successful. Please verify your email address.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",

  // Email Verification
  EMAIL_VERIFICATION_SUCCESS:
    "Email verified successfully. You can now sign in.",
  EMAIL_VERIFICATION_FAILED: "Email verification failed. Please try again.",
  EMAIL_VERIFICATION_REQUIRED:
    "Please verify your email address before signing in.",

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
