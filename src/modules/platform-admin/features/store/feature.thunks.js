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

  {
    condition: (_, { getState }) => {
      const status = getState().features?.status;

      return status !== "loading";
    },
  },
);

/**
 * =============================================================================
 * Fetch Feature By ID
 * =============================================================================
 */

export const fetchFeatureById = createAsyncThunk(
  "features/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await featureService.getFeatureById(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to fetch feature.",
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

/**
 * =============================================================================
 * Activate Feature
 * =============================================================================
 */

export const activateFeature = createAsyncThunk(
  "features/activate",

  async (id, { rejectWithValue }) => {
    try {
      const response = await featureService.activateFeature(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to activate feature.",
      );
    }
  },
);

/**
 * =============================================================================
 * Deactivate Feature
 * =============================================================================
 */

export const deactivateFeature = createAsyncThunk(
  "features/deactivate",

  async (id, { rejectWithValue }) => {
    try {
      const response = await featureService.deactivateFeature(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to deactivate feature.",
      );
    }
  },
);

/**
 * =============================================================================
 * Delete Feature
 * =============================================================================
 */

export const deleteFeature = createAsyncThunk(
  "features/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await featureService.deleteFeature(id);

      return {
        id,
        data: response.data?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to delete feature.",
      );
    }
  },
);

/**
 * =============================================================================
 * Restore Feature
 * =============================================================================
 */

export const restoreFeature = createAsyncThunk(
  "features/restore",

  async (id, { rejectWithValue }) => {
    try {
      const response = await featureService.restoreFeature(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to restore feature.",
      );
    }
  },
);
