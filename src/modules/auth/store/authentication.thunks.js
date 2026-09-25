import { createAsyncThunk } from "@reduxjs/toolkit";

import authenticationService from "../services/authentication.service.js";
import AUTH_MESSAGES from "../constants/authentication.messages.js";

// Normalize API Error
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

// Login
export const login = createAsyncThunk(
  "authentication/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.login(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.LOGIN_FAILED),
      );
    }
  },
);

// Refresh
export const refresh = createAsyncThunk(
  "authentication/refresh",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.refresh(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.REFRESH_FAILED),
      );
    }
  },
);

// Current User
export const getCurrentUser = createAsyncThunk(
  "authentication/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticationService.getCurrentUser();

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.CURRENT_USER_FETCH_FAILED),
      );
    }
  },
);

// Logout
export const logout = createAsyncThunk(
  "authentication/logout",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.logout(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, AUTH_MESSAGES.LOGOUT_FAILED),
      );
    }
  },
);
