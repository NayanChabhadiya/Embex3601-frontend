import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  login as loginService,
  logout as logoutService,
  refreshToken as refreshTokenService,
  getCurrentUser as getCurrentUserService,
} from "../services/auth.service";

const normalizeThunkError = (error) => {
  if (!error || typeof error !== "object") {
    return {
      message: "An unexpected error occurred.",
      status: null,
      code: null,
      details: null,
    };
  }

  return {
    message:
      typeof error.message === "string"
        ? error.message
        : "An unexpected error occurred.",
    status: error.status ?? null,
    code: error.code ?? null,
    details: error.details ?? null,
  };
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginService(credentials);

      return response;
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error));
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutService();

      return response;
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error));
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshTokenService();

      return response;
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error));
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserService();

      return response;
    } catch (error) {
      return rejectWithValue(normalizeThunkError(error));
    }
  },
);
