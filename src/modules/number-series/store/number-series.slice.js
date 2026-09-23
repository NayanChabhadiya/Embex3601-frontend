import { createSlice } from "@reduxjs/toolkit";

import {
  fetchNumberSeries,
  fetchNumberSeriesById,
  createNumberSeries,
  updateNumberSeries,
  deleteNumberSeries,
} from "./number-series.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  numberSeries: [],
  selectedNumberSeries: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const numberSeriesSlice = createSlice({
  name: "numberSeries",

  initialState,

  reducers: {
    // --------------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------------

    clearNumberSeriesError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------------
    // CLEAR SELECTED NUMBER SERIES
    // --------------------------------------------------------

    clearSelectedNumberSeries: (state) => {
      state.selectedNumberSeries = null;
    },

    // --------------------------------------------------------
    // RESET STATE
    // --------------------------------------------------------

    resetNumberSeriesState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL NUMBER SERIES
    // ========================================================

    builder
      .addCase(fetchNumberSeries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchNumberSeries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.numberSeries = action.payload || [];
      })

      .addCase(fetchNumberSeries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch number series.";
      });

    // ========================================================
    // FETCH NUMBER SERIES BY ID
    // ========================================================

    builder
      .addCase(fetchNumberSeriesById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchNumberSeriesById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedNumberSeries = action.payload || null;
      })

      .addCase(fetchNumberSeriesById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch number series.";
      });

    // ========================================================
    // CREATE NUMBER SERIES
    // ========================================================

    builder
      .addCase(createNumberSeries.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createNumberSeries.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.numberSeries.unshift(action.payload);
        }
      })

      .addCase(createNumberSeries.rejected, (state, action) => {
        state.createStatus = "failed";

        state.error = action.payload || "Failed to create number series.";
      });

    // ========================================================
    // UPDATE NUMBER SERIES
    // ========================================================

    builder
      .addCase(updateNumberSeries.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateNumberSeries.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedNumberSeries = action.payload;

        if (!updatedNumberSeries?._id) {
          return;
        }

        const index = state.numberSeries.findIndex(
          (numberSeries) => numberSeries._id === updatedNumberSeries._id,
        );

        if (index !== -1) {
          state.numberSeries[index] = updatedNumberSeries;
        }

        if (state.selectedNumberSeries?._id === updatedNumberSeries._id) {
          state.selectedNumberSeries = updatedNumberSeries;
        }
      })

      .addCase(updateNumberSeries.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.error = action.payload || "Failed to update number series.";
      });

    // ========================================================
    // DELETE NUMBER SERIES
    // ========================================================

    builder
      .addCase(deleteNumberSeries.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteNumberSeries.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.numberSeries = state.numberSeries.filter(
          (numberSeries) => numberSeries._id !== deletedId,
        );

        if (state.selectedNumberSeries?._id === deletedId) {
          state.selectedNumberSeries = null;
        }
      })

      .addCase(deleteNumberSeries.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.error = action.payload || "Failed to delete number series.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const {
  clearNumberSeriesError,
  clearSelectedNumberSeries,
  resetNumberSeriesState,
} = numberSeriesSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default numberSeriesSlice.reducer;
