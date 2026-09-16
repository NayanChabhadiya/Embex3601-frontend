import { createAsyncThunk } from "@reduxjs/toolkit";

import planFeatureService from "../services/plan-feature.service.js";

export const fetchPlanFeatures = createAsyncThunk(
  "planFeatures/fetchAll",
  async ({ subscriptionPlanId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.getPlanFeatures(
        subscriptionPlanId,
        params,
      );

      return {
        features: response.data?.data ?? [],
        meta: response.data?.meta ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to fetch plan features.",
      );
    }
  },
);

export const createPlanFeature = createAsyncThunk(
  "planFeatures/create",
  async ({ subscriptionPlanId, payload }, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.createPlanFeature(
        subscriptionPlanId,
        payload,
      );

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ??
          "Unable to assign feature to subscription plan.",
      );
    }
  },
);

export const updatePlanFeature = createAsyncThunk(
  "planFeatures/update",
  async ({ subscriptionPlanId, featureId, payload }, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.updatePlanFeature(
        subscriptionPlanId,
        featureId,
        payload,
      );

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to update plan feature.",
      );
    }
  },
);

export const deletePlanFeature = createAsyncThunk(
  "planFeatures/delete",
  async ({ subscriptionPlanId, featureId }, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.deletePlanFeature(
        subscriptionPlanId,
        featureId,
      );

      return {
        featureId,
        data: response.data?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ??
          "Unable to remove feature from subscription plan.",
      );
    }
  },
);
