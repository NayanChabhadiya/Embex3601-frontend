import { createSlice } from "@reduxjs/toolkit";

import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} from "./purchase.thunks.js";

const initialState = {
  purchases: [],
  selectedPurchase: null,
  status: "idle",
  error: null,
};

const purchaseSlice = createSlice({
  name: "purchase",

  initialState,

  reducers: {
    clearSelectedPurchase: (state) => {
      state.selectedPurchase = null;
    },

    clearPurchaseError: (state) => {
      state.error = null;
    },

    resetPurchaseState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // CREATE
    // ========================================================

    builder
      .addCase(createPurchase.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createPurchase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const data = action.payload?.data;

        const purchase = data?.purchase ?? data ?? null;

        if (purchase) {
          state.purchases.unshift(purchase);
        }

        state.selectedPurchase = data || null;
      })

      .addCase(createPurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create purchase";
      });

    // ========================================================
    // GET ALL
    // ========================================================

    builder
      .addCase(getPurchases.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getPurchases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        state.purchases = action.payload?.data ?? action.payload ?? [];
      })

      .addCase(getPurchases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch purchases";
      });

    // ========================================================
    // GET BY ID
    // ========================================================

    builder
      .addCase(getPurchaseById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getPurchaseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        state.selectedPurchase = action.payload?.data ?? action.payload ?? null;
      })

      .addCase(getPurchaseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch purchase";
      });

    // ========================================================
    // UPDATE
    // ========================================================

    builder
      .addCase(updatePurchase.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const data = action.payload?.data;

        const purchase = data?.purchase ?? data ?? null;

        if (purchase?._id) {
          const index = state.purchases.findIndex(
            (item) => item._id === purchase._id,
          );

          if (index !== -1) {
            state.purchases[index] = purchase;
          }
        }

        state.selectedPurchase = data || null;
      })

      .addCase(updatePurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update purchase";
      });

    // ========================================================
    // DELETE
    // ========================================================

    builder
      .addCase(deletePurchase.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const deletedId = action.payload?.id;

        state.purchases = state.purchases.filter(
          (purchase) => purchase._id !== deletedId,
        );

        if (state.selectedPurchase?._id === deletedId) {
          state.selectedPurchase = null;
        }
      })

      .addCase(deletePurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete purchase";
      });
  },
});

export const { clearSelectedPurchase, clearPurchaseError, resetPurchaseState } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;
