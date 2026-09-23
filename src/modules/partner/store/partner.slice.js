import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPartners,
  fetchPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} from "./partner.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  partners: [],
  selectedPartner: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const partnerSlice = createSlice({
  name: "partner",

  initialState,

  reducers: {
    // --------------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------------

    clearPartnerError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------------
    // CLEAR SELECTED PARTNER
    // --------------------------------------------------------

    clearSelectedPartner: (state) => {
      state.selectedPartner = null;
    },

    // --------------------------------------------------------
    // RESET STATE
    // --------------------------------------------------------

    resetPartnerState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL PARTNERS
    // ========================================================

    builder
      .addCase(fetchPartners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partners = action.payload || [];
      })

      .addCase(fetchPartners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch partners.";
      });

    // ========================================================
    // FETCH PARTNER BY ID
    // ========================================================

    builder
      .addCase(fetchPartnerById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPartnerById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPartner = action.payload || null;
      })

      .addCase(fetchPartnerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch partner.";
      });

    // ========================================================
    // CREATE PARTNER
    // ========================================================

    builder
      .addCase(createPartner.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createPartner.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.partners.unshift(action.payload);
        }
      })

      .addCase(createPartner.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || "Failed to create partner.";
      });

    // ========================================================
    // UPDATE PARTNER
    // ========================================================

    builder
      .addCase(updatePartner.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updatePartner.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedPartner = action.payload;

        if (!updatedPartner?._id) {
          return;
        }

        const index = state.partners.findIndex(
          (partner) => partner._id === updatedPartner._id,
        );

        if (index !== -1) {
          state.partners[index] = updatedPartner;
        }

        if (state.selectedPartner?._id === updatedPartner._id) {
          state.selectedPartner = updatedPartner;
        }
      })

      .addCase(updatePartner.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload || "Failed to update partner.";
      });

    // ========================================================
    // DELETE PARTNER
    // ========================================================

    builder
      .addCase(deletePartner.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deletePartner.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.partners = state.partners.filter(
          (partner) => partner._id !== deletedId,
        );

        if (state.selectedPartner?._id === deletedId) {
          state.selectedPartner = null;
        }
      })

      .addCase(deletePartner.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete partner.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const { clearPartnerError, clearSelectedPartner, resetPartnerState } =
  partnerSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default partnerSlice.reducer;
