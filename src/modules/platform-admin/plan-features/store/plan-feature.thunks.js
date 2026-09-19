import { createAsyncThunk } from "@reduxjs/toolkit";
import planFeatureService from "../services/plan-feature.service";

export const fetchPlanFeatures = createAsyncThunk(
  "planFeature/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.getAll();

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch plan features.",
      );
    }
  },
);

export const fetchPlanFeatureById = createAsyncThunk(
  "planFeature/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch plan feature.",
      );
    }
  },
);

export const createPlanFeature = createAsyncThunk(
  "planFeature/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create plan feature.",
      );
    }
  },
);

export const updatePlanFeature = createAsyncThunk(
  "planFeature/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update plan feature.",
      );
    }
  },
);

export const deletePlanFeature = createAsyncThunk(
  "planFeature/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.delete(id);

      return {
        id,
        data: response?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete plan feature.",
      );
    }
  },
);
