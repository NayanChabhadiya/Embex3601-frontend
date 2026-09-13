import { createAsyncThunk } from "@reduxjs/toolkit";
import platformAdminService from "../services/platform-admin.service.js";

export const fetchPlatformAdminAccess = createAsyncThunk(
  "platformAdmin/fetchAccess",
  async (_, { rejectWithValue }) => {
    try {
      const response = await platformAdminService.getAccess();

      return response.data?.data ?? response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ??
          "Unable to resolve Platform Admin access.",
      );
    }
  },
);