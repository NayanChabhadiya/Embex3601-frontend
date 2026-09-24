import { createSlice } from "@reduxjs/toolkit";

import {
  createJobWork,
  getJobWorks,
  getJobWorkById,
  updateJobWork,
  deleteJobWork,
} from "./job-work.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  jobWorks: [],

  selectedJobWork: null,

  status: "idle",

  submitStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const jobWorkSlice = createSlice({
  name: "jobWork",

  initialState,

  reducers: {
    // ========================================================
    // CLEAR ERROR
    // ========================================================

    clearJobWorkError(state) {
      state.error = null;
    },

    // ========================================================
    // CLEAR SELECTED
    // ========================================================

    clearSelectedJobWork(state) {
      state.selectedJobWork = null;
    },

    // ========================================================
    // RESET
    // ========================================================

    resetJobWorkState(state) {
      state.status = "idle";
      state.submitStatus = "idle";
      state.error = null;
      state.selectedJobWork = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // GET ALL
      // ======================================================

      .addCase(getJobWorks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getJobWorks.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.jobWorks = action.payload || [];
      })

      .addCase(getJobWorks.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch job works.";
      })

      // ======================================================
      // GET BY ID
      // ======================================================

      .addCase(getJobWorkById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getJobWorkById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedJobWork = action.payload || null;
      })

      .addCase(getJobWorkById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch job work.";
      })

      // ======================================================
      // CREATE
      // ======================================================

      .addCase(createJobWork.pending, (state) => {
        state.submitStatus = "loading";

        state.error = null;
      })

      .addCase(createJobWork.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";

        state.selectedJobWork =
          action.payload?.jobWork || action.payload || null;
      })

      .addCase(createJobWork.rejected, (state, action) => {
        state.submitStatus = "failed";

        state.error = action.payload || "Failed to create job work.";
      })

      // ======================================================
      // UPDATE
      // ======================================================

      .addCase(updateJobWork.pending, (state) => {
        state.submitStatus = "loading";

        state.error = null;
      })

      .addCase(updateJobWork.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";

        state.selectedJobWork =
          action.payload?.jobWork || action.payload || null;
      })

      .addCase(updateJobWork.rejected, (state, action) => {
        state.submitStatus = "failed";

        state.error = action.payload || "Failed to update job work.";
      })

      // ======================================================
      // DELETE
      // ======================================================

      .addCase(deleteJobWork.pending, (state) => {
        state.submitStatus = "loading";

        state.error = null;
      })

      .addCase(deleteJobWork.fulfilled, (state) => {
        state.submitStatus = "succeeded";
      })

      .addCase(deleteJobWork.rejected, (state, action) => {
        state.submitStatus = "failed";

        state.error = action.payload || "Failed to delete job work.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const { clearJobWorkError, clearSelectedJobWork, resetJobWorkState } =
  jobWorkSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default jobWorkSlice.reducer;
