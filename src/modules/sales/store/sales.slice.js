import { createSlice } from "@reduxjs/toolkit";

import {
  createSales,
  getSales,
  getSalesById,
  updateSales,
  deleteSales,
} from "./sales.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  sales: [],

  selectedSale: null,

  status: "idle",

  submitStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const salesSlice = createSlice({
  name: "sales",

  initialState,

  reducers: {
    // ========================================================
    // CLEAR ERROR
    // ========================================================

    clearSalesError(state) {
      state.error = null;
    },

    // ========================================================
    // CLEAR SELECTED SALE
    // ========================================================

    clearSelectedSale(state) {
      state.selectedSale = null;
    },

    // ========================================================
    // RESET STATE
    // ========================================================

    resetSalesState(state) {
      state.status = "idle";
      state.submitStatus = "idle";
      state.error = null;
      state.selectedSale = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // GET SALES
      // ======================================================

      .addCase(getSales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getSales.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.sales = action.payload || [];
      })

      .addCase(getSales.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch sales.";
      })

      // ======================================================
      // GET SALES BY ID
      // ======================================================

      .addCase(getSalesById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getSalesById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedSale = action.payload || null;
      })

      .addCase(getSalesById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch sale.";
      })

      // ======================================================
      // CREATE SALES
      // ======================================================

      .addCase(createSales.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })

      .addCase(createSales.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";

        state.selectedSale = action.payload?.sales || action.payload || null;
      })

      .addCase(createSales.rejected, (state, action) => {
        state.submitStatus = "failed";

        state.error = action.payload || "Failed to create sales.";
      })

      // ======================================================
      // UPDATE SALES
      // ======================================================

      .addCase(updateSales.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })

      .addCase(updateSales.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";

        state.selectedSale = action.payload?.sales || action.payload || null;
      })

      .addCase(updateSales.rejected, (state, action) => {
        state.submitStatus = "failed";

        state.error = action.payload || "Failed to update sales.";
      })

      // ======================================================
      // DELETE SALES
      // ======================================================

      .addCase(deleteSales.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })

      .addCase(deleteSales.fulfilled, (state) => {
        state.submitStatus = "succeeded";
      })

      .addCase(deleteSales.rejected, (state, action) => {
        state.submitStatus = "failed";

        state.error = action.payload || "Failed to delete sales.";
      });
  },
});

export const { clearSalesError, clearSelectedSale, resetSalesState } =
  salesSlice.actions;

export default salesSlice.reducer;
