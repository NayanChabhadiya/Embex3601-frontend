import { createAsyncThunk } from "@reduxjs/toolkit";

import authenticationService from "../services/authentication.service.js";
import AUTH_MESSAGES from "../constants/authentication.messages.js";
import AUTHENTICATION_CONSTANTS from "../constants/authentication.constants.js";

// -----------------------------------------------------------------------------
// Normalize API Error
// -----------------------------------------------------------------------------

const getErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === "string") {
    return responseData.message;
  }

  if (typeof responseData?.message?.message === "string") {
    return responseData.message.message;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return fallbackMessage;
};

// -----------------------------------------------------------------------------
// Login
// -----------------------------------------------------------------------------

export const login = createAsyncThunk(
  "authentication/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.login(payload);

      const data = response?.data ?? null;

      if (data?.accessToken) {
        localStorage.setItem("embex360_access_token", data.accessToken);
      }

      if (data?.refreshToken) {
        localStorage.setItem("embex360_refresh_token", data.refreshToken);
      }

      if (data?.sessionId) {
        localStorage.setItem(
          AUTHENTICATION_CONSTANTS.STORAGE_KEYS.SESSION_ID,
          data.sessionId,
        );
      }

      if (data?.user) {
        localStorage.setItem("embex360_user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.LOGIN_FAILED),
      );
    }
  },
);
// -----------------------------------------------------------------------------
// Refresh
// -----------------------------------------------------------------------------

export const refresh = createAsyncThunk(
  "authentication/refresh",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.refresh(payload);

      const data = response?.data ?? null;

      if (data?.accessToken) {
        localStorage.setItem("embex360_access_token", data.accessToken);
      }

      if (data?.refreshToken) {
        localStorage.setItem("embex360_refresh_token", data.refreshToken);
      }

      if (data?.user) {
        localStorage.setItem("embex360_user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      localStorage.removeItem("embex360_access_token");
      localStorage.removeItem("embex360_refresh_token");
      localStorage.removeItem("embex360_user");

      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.REFRESH_FAILED),
      );
    }
  },
);

// -----------------------------------------------------------------------------
// Current User
// -----------------------------------------------------------------------------

export const getCurrentUser = createAsyncThunk(
  "authentication/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticationService.getCurrentUser();

      const data = response?.data ?? null;

      if (data) {
        localStorage.setItem(
          AUTHENTICATION_CONSTANTS.STORAGE_KEYS.USER,
          JSON.stringify(data),
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.CURRENT_USER_FETCH_FAILED),
      );
    }
  },
);

// -----------------------------------------------------------------------------
// Logout
// -----------------------------------------------------------------------------

export const logout = createAsyncThunk(
  "authentication/logout",
  async (payload, { rejectWithValue }) => {
    try {
      const sessionId = localStorage.getItem(
        AUTHENTICATION_CONSTANTS.STORAGE_KEYS.SESSION_ID,
      );

      const response = await authenticationService.logout({
        sessionId,
      });

      // -----------------------------------------------------------------------
      // Clear Authentication Storage
      // -----------------------------------------------------------------------

      localStorage.removeItem(
        AUTHENTICATION_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN,
      );

      localStorage.removeItem(
        AUTHENTICATION_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN,
      );

      localStorage.removeItem(AUTHENTICATION_CONSTANTS.STORAGE_KEYS.USER);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.LOGOUT_FAILED),
      );
    }
  },
);
