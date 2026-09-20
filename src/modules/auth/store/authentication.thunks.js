import { createAsyncThunk } from "@reduxjs/toolkit";

import authenticationService from "../services/authentication.service.js";

export const login = createAsyncThunk(
  "authentication/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.login(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Login failed.",
      );
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "authentication/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticationService.getCurrentUser();

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch current user.",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "authentication/logout",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.logout(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Logout failed.",
      );
    }
  },
);
