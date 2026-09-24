import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createGST as createGSTService,
  getGSTDocuments as getGSTDocumentsService,
  getGSTById as getGSTByIdService,
  updateGST as updateGSTService,
  deleteGST as deleteGSTService,
} from "../services/gst.service.js";

// ============================================================
// GET GST DOCUMENTS
// ============================================================

export const getGSTDocuments = createAsyncThunk(
  "gst/getGSTDocuments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getGSTDocumentsService(params);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch GST documents.",
      );
    }
  },
);

// ============================================================
// GET GST BY ID
// ============================================================

export const getGSTById = createAsyncThunk(
  "gst/getGSTById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getGSTByIdService(id);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch GST document.",
      );
    }
  },
);

// ============================================================
// CREATE GST
// ============================================================

export const createGST = createAsyncThunk(
  "gst/createGST",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createGSTService(payload);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to create GST document.",
      );
    }
  },
);

// ============================================================
// UPDATE GST
// ============================================================

export const updateGST = createAsyncThunk(
  "gst/updateGST",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateGSTService(id, payload);

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update GST document.",
      );
    }
  },
);

// ============================================================
// DELETE GST
// ============================================================

export const deleteGST = createAsyncThunk(
  "gst/deleteGST",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteGSTService(id);

      return response?.data ?? response ?? id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete GST document.",
      );
    }
  },
);
