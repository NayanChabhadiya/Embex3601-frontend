import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  login,
  refresh,
  getCurrentUser,
  logout,
} from "../store/authentication.thunks.js";

import {
  clearAuthentication,
  clearAuthenticationError,
} from "../store/authentication.slice.js";

import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthenticationStatus,
  selectAuthenticationError,
  selectIsAuthenticationLoading,
  selectHasAuthenticationError,
} from "../store/authentication.selectors.js";

import AUTH_MESSAGES from "../constants/authentication.messages.js";

// -----------------------------------------------------------------------------
// Normalize Thunk Result
// -----------------------------------------------------------------------------

const normalizeThunkResult = (result, fulfilledMatcher, fallbackMessage) => {
  if (fulfilledMatcher(result)) {
    return {
      success: true,
      data: result.payload ?? null,
      error: null,
    };
  }

  return {
    success: false,
    data: null,
    error:
      typeof result?.payload === "string"
        ? result.payload
        : typeof result?.payload?.message === "string"
          ? result.payload.message
          : fallbackMessage,
  };
};

// -----------------------------------------------------------------------------
// Authentication Hook
// -----------------------------------------------------------------------------

const useAuthentication = () => {
  const dispatch = useDispatch();

  // ---------------------------------------------------------------------------
  // Authentication State
  // ---------------------------------------------------------------------------

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthenticationStatus);
  const error = useSelector(selectAuthenticationError);
  const isLoading = useSelector(selectIsAuthenticationLoading);
  const hasError = useSelector(selectHasAuthenticationError);

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  const handleLogin = useCallback(
    async (payload) => {
      const result = await dispatch(login(payload));

      return normalizeThunkResult(
        result,
        login.fulfilled.match,
        AUTH_MESSAGES.LOGIN_FAILED,
      );
    },
    [dispatch],
  );

  // ---------------------------------------------------------------------------
  // Refresh Access Token
  // ---------------------------------------------------------------------------

  const handleRefresh = useCallback(
    async (payload) => {
      const result = await dispatch(refresh(payload));

      return normalizeThunkResult(
        result,
        refresh.fulfilled.match,
        AUTH_MESSAGES.REFRESH_FAILED,
      );
    },
    [dispatch],
  );

  // ---------------------------------------------------------------------------
  // Get Current User
  // ---------------------------------------------------------------------------

  const handleGetCurrentUser = useCallback(async () => {
    const result = await dispatch(getCurrentUser());

    return normalizeThunkResult(
      result,
      getCurrentUser.fulfilled.match,
      AUTH_MESSAGES.CURRENT_USER_FETCH_FAILED,
    );
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  const handleLogout = useCallback(
    async (payload) => {
      const result = await dispatch(logout(payload));

      return normalizeThunkResult(
        result,
        logout.fulfilled.match,
        AUTH_MESSAGES.LOGOUT_FAILED,
      );
    },
    [dispatch],
  );

  // ---------------------------------------------------------------------------
  // Clear Authentication
  // ---------------------------------------------------------------------------

  const handleClearAuthentication = useCallback(() => {
    dispatch(clearAuthentication());
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Clear Authentication Error
  // ---------------------------------------------------------------------------

  const handleClearAuthenticationError = useCallback(() => {
    dispatch(clearAuthenticationError());
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Hook API
  // ---------------------------------------------------------------------------

  return {
    // State
    user,
    isAuthenticated,
    status,
    error,
    isLoading,
    hasError,

    // Operations
    login: handleLogin,
    refresh: handleRefresh,
    getCurrentUser: handleGetCurrentUser,
    logout: handleLogout,

    // State Actions
    clearAuthentication: handleClearAuthentication,
    clearAuthenticationError: handleClearAuthenticationError,
  };
};

export default useAuthentication;
