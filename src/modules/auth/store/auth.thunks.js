import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  login as loginRequest,
  refreshToken as refreshTokenRequest,
  logout as logoutRequest,
  logoutAll as logoutAllRequest,
} from "../services/auth.service";

import {
  initializeAuth,
  loginSuccess,
  updateAccessToken,
  setLoading,
  authFailure,
  logoutSuccess,
} from "./auth.slice";
import { fetchPlatformAdminAccess } from "../../platform-admin/store/platform-admin.thunks.js";

const getAuthData = (response) => {
  return response?.data?.data ?? null;
};

const getAccessToken = (auth) => {
  return auth?.accessToken ?? null;
};

/**
 * Restore existing authentication session.
 *
 * Refresh token is handled automatically by the browser
 * through the HttpOnly cookie.
 */
export const initializeSession = createAsyncThunk(
  "auth/initializeSession",
  async (_, { dispatch }) => {
    dispatch(setLoading());

    try {
      const response = await refreshTokenRequest();
      const auth = getAuthData(response);
      const accessToken = getAccessToken(auth);

      if (!accessToken) {
        throw new Error(
          "Authentication refresh did not return an access token.",
        );
      }

      dispatch(
        initializeAuth({
          isAuthenticated: true,
          accessToken,
          user: auth?.user ?? auth?.account ?? null,
          workspace: auth?.workspace ?? null,
          company: auth?.company ?? null,
          permissions: Array.isArray(auth?.permissions) ? auth.permissions : [],
        }),
      );

      dispatch(fetchPlatformAdminAccess());

      return auth;
    } catch {
      dispatch(
        initializeAuth({
          isAuthenticated: false,
          accessToken: null,
          user: null,
          workspace: null,
          company: null,
          permissions: [],
        }),
      );

      return null;
    }
  },
  {
    condition: (_, { getState }) => {
      const status = getState().auth?.status;

      return status !== "loading";
    },
  },
);

/**
 * Login
 */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading());

      const response = await loginRequest(credentials);

      const auth = getAuthData(response);
      const accessToken = getAccessToken(auth);

      if (!accessToken) {
        throw new Error("Authentication login did not return an access token.");
      }

      dispatch(
        loginSuccess({
          accessToken,
          user: auth?.user ?? auth?.account ?? null,
          workspace: auth?.workspace ?? null,
          company: auth?.company ?? null,
          permissions: Array.isArray(auth?.permissions) ? auth.permissions : [],
        }),
      );

      dispatch(fetchPlatformAdminAccess());

      return auth;
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        "Unable to sign in. Please try again.";

      dispatch(authFailure(message));

      return rejectWithValue(message);
    }
  },
);

/**
 * Refresh access token after an expired access token.
 *
 * Normally this is handled automatically by the Axios interceptor.
 * This thunk remains available for explicit session refresh operations.
 */
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await refreshTokenRequest();

      const auth = getAuthData(response);
      const accessToken = getAccessToken(auth);

      if (!accessToken) {
        throw new Error(
          "Authentication refresh did not return an access token.",
        );
      }

      dispatch(
        updateAccessToken({
          accessToken,
        }),
      );

      return auth;
    } catch (error) {
      dispatch(logoutSuccess());

      const message =
        error?.response?.data?.message ??
        "Your session has expired. Please sign in again.";

      return rejectWithValue(message);
    }
  },
);

/**
 * Logout
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await logoutRequest();
    } finally {
      dispatch(logoutSuccess());
    }
  },
);

export const logoutAll = createAsyncThunk(
  "auth/logoutAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutAllRequest();
      dispatch(logoutSuccess());
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        "Unable to sign out from all sessions.";

      return rejectWithValue(message);
    }
  },
);
