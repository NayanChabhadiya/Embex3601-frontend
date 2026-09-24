import { createAsyncThunk } from "@reduxjs/toolkit";

import jobWorkService from "../services/job-work.service.js";

// ============================================================
// CREATE
// ============================================================

export const createJobWork = createAsyncThunk(
  "jobWork/createJobWork",
  async (payload, { rejectWithValue }) => {
    try {
      return await jobWorkService.createJobWork(payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create job work.",
      );
    }
  },
);

// ============================================================
// GET ALL
// ============================================================

export const getJobWorks = createAsyncThunk(
  "jobWork/getJobWorks",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await jobWorkService.getJobWorks(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch job works.",
      );
    }
  },
);

// ============================================================
// GET BY ID
// ============================================================

export const getJobWorkById = createAsyncThunk(
  "jobWork/getJobWorkById",
  async (id, { rejectWithValue }) => {
    try {
      return await jobWorkService.getJobWorkById(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch job work.",
      );
    }
  },
);

// ============================================================
// UPDATE
// ============================================================

export const updateJobWork = createAsyncThunk(
  "jobWork/updateJobWork",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await jobWorkService.updateJobWork(id, payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update job work.",
      );
    }
  },
);

// ============================================================
// DELETE
// ============================================================

export const deleteJobWork = createAsyncThunk(
  "jobWork/deleteJobWork",
  async (id, { rejectWithValue }) => {
    try {
      return await jobWorkService.deleteJobWork(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete job work.",
      );
    }
  },
);
