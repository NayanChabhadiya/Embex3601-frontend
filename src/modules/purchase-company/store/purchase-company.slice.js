import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPurchaseCompanies,
  fetchPurchaseCompanyById,
  createPurchaseCompany,
  updatePurchaseCompany,
  deletePurchaseCompany,
} from "./purchase-company.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  purchaseCompanies: [],
  selectedPurchaseCompany: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const purchaseCompanySlice = createSlice({
  name: "purchaseCompany",

  initialState,

  reducers: {
    // --------------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------------

    clearPurchaseCompanyError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------------
    // CLEAR SELECTED
    // --------------------------------------------------------

    clearSelectedPurchaseCompany: (state) => {
      state.selectedPurchaseCompany = null;
    },

    // --------------------------------------------------------
    // RESET
    // --------------------------------------------------------

    resetPurchaseCompanyState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL
    // ========================================================

    builder
      .addCase(fetchPurchaseCompanies.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("slice");
      })

      .addCase(fetchPurchaseCompanies.fulfilled, (state, action) => {
        console.log("slice", action, state);
        state.status = "succeeded";

        // IMPORTANT
        state.purchaseCompanies = action.payload || [];
      })

      .addCase(fetchPurchaseCompanies.rejected, (state, action) => {
        state.status = "failed";
        console.log("slice", action);
        state.error = action.payload || "Failed to fetch purchase companies.";
      });

    // ========================================================
    // FETCH BY ID
    // ========================================================

    builder
      .addCase(fetchPurchaseCompanyById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPurchaseCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedPurchaseCompany = action.payload || null;
      })

      .addCase(fetchPurchaseCompanyById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch purchase company.";
      });

    // ========================================================
    // CREATE
    // ========================================================

    builder
      .addCase(createPurchaseCompany.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createPurchaseCompany.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.purchaseCompanies.unshift(action.payload);
        }
      })

      .addCase(createPurchaseCompany.rejected, (state, action) => {
        state.createStatus = "failed";

        state.error = action.payload || "Failed to create purchase company.";
      });

    // ========================================================
    // UPDATE
    // ========================================================

    builder
      .addCase(updatePurchaseCompany.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updatePurchaseCompany.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedPurchaseCompany = action.payload;

        if (!updatedPurchaseCompany?._id) {
          return;
        }

        const index = state.purchaseCompanies.findIndex(
          (purchaseCompany) =>
            purchaseCompany._id === updatedPurchaseCompany._id,
        );

        if (index !== -1) {
          state.purchaseCompanies[index] = updatedPurchaseCompany;
        }

        if (state.selectedPurchaseCompany?._id === updatedPurchaseCompany._id) {
          state.selectedPurchaseCompany = updatedPurchaseCompany;
        }
      })

      .addCase(updatePurchaseCompany.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.error = action.payload || "Failed to update purchase company.";
      });

    // ========================================================
    // DELETE
    // ========================================================

    builder
      .addCase(deletePurchaseCompany.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deletePurchaseCompany.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.purchaseCompanies = state.purchaseCompanies.filter(
          (purchaseCompany) => purchaseCompany._id !== deletedId,
        );

        if (state.selectedPurchaseCompany?._id === deletedId) {
          state.selectedPurchaseCompany = null;
        }
      })

      .addCase(deletePurchaseCompany.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.error = action.payload || "Failed to delete purchase company.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const {
  clearPurchaseCompanyError,
  clearSelectedPurchaseCompany,
  resetPurchaseCompanyState,
} = purchaseCompanySlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default purchaseCompanySlice.reducer;
