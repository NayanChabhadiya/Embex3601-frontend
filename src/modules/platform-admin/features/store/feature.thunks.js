import { createAsyncThunk } from "@reduxjs/toolkit";
import featureService from "../services/feature.service.js";

/**
 * =============================================================================
 * Fetch Features
 * =============================================================================
 */
export const fetchFeatures = createAsyncThunk(
  "features/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await featureService.getFeatures(params);

      return {
        features: response.data?.data ?? [],
        meta: response.data?.meta ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to fetch features.",
      );
    }
  },
);

/**
 * =============================================================================
 * Create Feature
 * =============================================================================
 */
export const createFeature = createAsyncThunk(
  "features/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await featureService.createFeature(payload);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to create feature.",
      );
    }
  },
);

/**
 * =============================================================================
 * Update Feature
 * =============================================================================
 */
export const updateFeature = createAsyncThunk(
  "features/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await featureService.updateFeature(id, payload);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to update feature.",
      );
    }
  },
);
