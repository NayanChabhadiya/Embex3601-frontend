import { createSlice } from "@reduxjs/toolkit";

import {
  fetchFinancialYears,
  fetchFinancialYearById,
  createFinancialYear,
  updateFinancialYear,
  deleteFinancialYear,
} from "./financial-year.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  financialYears: [],

  selectedFinancialYear: null,

  status: "idle",

  createStatus: "idle",

  updateStatus: "idle",

  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const financialYearSlice = createSlice({
  name: "financialYear",

  initialState,

  reducers: {
    // ========================================================
    // CLEAR ERROR
    // ========================================================

    clearFinancialYearError: (state) => {
      state.error = null;
    },

    // ========================================================
    // CLEAR SELECTED
    // ========================================================

    clearSelectedFinancialYear: (state) => {
      state.selectedFinancialYear = null;
    },

    // ========================================================
    // RESET STATE
    // ========================================================

    resetFinancialYearState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL
    // ========================================================

    builder
      .addCase(fetchFinancialYears.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchFinancialYears.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.financialYears = action.payload || [];
      })

      .addCase(fetchFinancialYears.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch financial years.";
      });

    // ========================================================
    // FETCH BY ID
    // ========================================================

    builder
      .addCase(fetchFinancialYearById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchFinancialYearById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedFinancialYear = action.payload || null;
      })

      .addCase(fetchFinancialYearById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch financial year.";
      });

    // ========================================================
    // CREATE
    // ========================================================

    builder
      .addCase(createFinancialYear.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createFinancialYear.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.financialYears.unshift(action.payload);
        }
      })

      .addCase(createFinancialYear.rejected, (state, action) => {
        state.createStatus = "failed";

        state.error = action.payload || "Failed to create financial year.";
      });

    // ========================================================
    // UPDATE
    // ========================================================

    builder
      .addCase(updateFinancialYear.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateFinancialYear.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedFinancialYear = action.payload;

        if (!updatedFinancialYear?._id) {
          return;
        }

        const index = state.financialYears.findIndex(
          (financialYear) => financialYear._id === updatedFinancialYear._id,
        );

        if (index !== -1) {
          state.financialYears[index] = updatedFinancialYear;
        }

        if (state.selectedFinancialYear?._id === updatedFinancialYear._id) {
          state.selectedFinancialYear = updatedFinancialYear;
        }
      })

      .addCase(updateFinancialYear.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.error = action.payload || "Failed to update financial year.";
      });

    // ========================================================
    // DELETE
    // ========================================================

    builder
      .addCase(deleteFinancialYear.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteFinancialYear.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.financialYears = state.financialYears.filter(
          (financialYear) => financialYear._id !== deletedId,
        );

        if (state.selectedFinancialYear?._id === deletedId) {
          state.selectedFinancialYear = null;
        }
      })

      .addCase(deleteFinancialYear.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.error = action.payload || "Failed to delete financial year.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const {
  clearFinancialYearError,
  clearSelectedFinancialYear,
  resetFinancialYearState,
} = financialYearSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default financialYearSlice.reducer;
