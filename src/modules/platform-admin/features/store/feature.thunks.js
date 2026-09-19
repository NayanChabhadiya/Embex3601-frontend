import { createAsyncThunk } from "@reduxjs/toolkit";

import featureService from "../services/feature.service";

export const fetchFeatures = createAsyncThunk(
  "feature/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await featureService.getAll();

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch features.",
      );
    }
  },
);

export const fetchFeatureById = createAsyncThunk(
  "feature/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await featureService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch feature.",
      );
    }
  },
);

export const createFeature = createAsyncThunk(
  "feature/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await featureService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create feature.",
      );
    }
  },
);

export const updateFeature = createAsyncThunk(
  "feature/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await featureService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update feature.",
      );
    }
  },
);

export const deleteFeature = createAsyncThunk(
  "feature/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await featureService.delete(id);

      return {
        id,
        data: response?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete feature.",
      );
    }
  },
);
