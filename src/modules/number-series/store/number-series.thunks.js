import { createAsyncThunk } from "@reduxjs/toolkit";

import numberSeriesService from "../services/number-series.service.js";

// ============================================================
// FETCH ALL NUMBER SERIES
// ============================================================

export const fetchNumberSeries = createAsyncThunk(
  "numberSeries/fetchAll",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await numberSeriesService.getAll(params);

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch number series.",
      );
    }
  },
);

// ============================================================
// FETCH NUMBER SERIES BY ID
// ============================================================

export const fetchNumberSeriesById = createAsyncThunk(
  "numberSeries/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await numberSeriesService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch number series.",
      );
    }
  },
);

// ============================================================
// CREATE NUMBER SERIES
// ============================================================

export const createNumberSeries = createAsyncThunk(
  "numberSeries/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await numberSeriesService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create number series.",
      );
    }
  },
);

// ============================================================
// UPDATE NUMBER SERIES
// ============================================================

export const updateNumberSeries = createAsyncThunk(
  "numberSeries/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await numberSeriesService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update number series.",
      );
    }
  },
);

// ============================================================
// DELETE NUMBER SERIES
// ============================================================

export const deleteNumberSeries = createAsyncThunk(
  "numberSeries/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await numberSeriesService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete number series.",
      );
    }
  },
);
