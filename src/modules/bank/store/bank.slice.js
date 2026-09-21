import { createSlice } from "@reduxjs/toolkit";

import {
  fetchBanks,
  fetchBankById,
  createBank,
  updateBank,
  deleteBank,
} from "./bank.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  banks: [],

  selectedBank: null,

  status: "idle",

  createStatus: "idle",

  updateStatus: "idle",

  deleteStatus: "idle",

  error: null,
};

// ============================================================
// BANK SLICE
// ============================================================

const bankSlice = createSlice({
  name: "bank",

  initialState,

  reducers: {
    // ========================================================
    // CLEAR ERROR
    // ========================================================

    clearBankError: (state) => {
      state.error = null;
    },

    // ========================================================
    // CLEAR SELECTED BANK
    // ========================================================

    clearSelectedBank: (state) => {
      state.selectedBank = null;
    },

    // ========================================================
    // RESET BANK STATE
    // ========================================================

    resetBankState: () => initialState,
  },

  // ==========================================================
  // ASYNC THUNKS
  // ==========================================================

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL BANKS
    // ========================================================

    builder
      .addCase(fetchBanks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.banks = action.payload || [];
      })

      .addCase(fetchBanks.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch banks.";
      });

    // ========================================================
    // FETCH BANK BY ID
    // ========================================================

    builder
      .addCase(fetchBankById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchBankById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedBank = action.payload || null;
      })

      .addCase(fetchBankById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch bank.";
      });

    // ========================================================
    // CREATE BANK
    // ========================================================

    builder
      .addCase(createBank.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createBank.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.banks.unshift(action.payload);
        }
      })

      .addCase(createBank.rejected, (state, action) => {
        state.createStatus = "failed";

        state.error = action.payload || "Failed to create bank.";
      });

    // ========================================================
    // UPDATE BANK
    // ========================================================

    builder
      .addCase(updateBank.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateBank.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedBank = action.payload;

        if (!updatedBank?._id) {
          return;
        }

        const index = state.banks.findIndex(
          (bank) => bank._id === updatedBank._id,
        );

        if (index !== -1) {
          state.banks[index] = updatedBank;
        }

        if (state.selectedBank?._id === updatedBank._id) {
          state.selectedBank = updatedBank;
        }
      })

      .addCase(updateBank.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.error = action.payload || "Failed to update bank.";
      });

    // ========================================================
    // DELETE BANK
    // ========================================================

    builder
      .addCase(deleteBank.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteBank.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.banks = state.banks.filter((bank) => bank._id !== deletedId);

        if (state.selectedBank?._id === deletedId) {
          state.selectedBank = null;
        }
      })

      .addCase(deleteBank.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.error = action.payload || "Failed to delete bank.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const { clearBankError, clearSelectedBank, resetBankState } =
  bankSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default bankSlice.reducer;
