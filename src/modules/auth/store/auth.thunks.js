import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  login as loginApi,
  refreshSession as refreshSessionApi,
} from "../services/auth.service";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to sign in. Please try again.";

      return rejectWithValue(message);
    }
  },
);

export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshSessionApi();

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Session expired. Please sign in again.";

      return rejectWithValue(message);
    }
  },
);
