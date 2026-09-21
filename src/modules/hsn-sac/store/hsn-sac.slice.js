import { createSlice } from "@reduxjs/toolkit";

import {
  fetchHsnSac,
  fetchHsnSacById,
  createHsnSac,
  updateHsnSac,
  deleteHsnSac,
} from "./hsn-sac.thunks.js";

const initialState = {
  hsnSacList: [],
  selectedHsnSac: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

const hsnSacSlice = createSlice({
  name: "hsnSac",

  initialState,

  reducers: {
    // ==========================================================
    // CLEAR ERROR
    // ==========================================================

    clearHsnSacError: (state) => {
      state.error = null;
    },

    // ==========================================================
    // CLEAR SELECTED HSN / SAC
    // ==========================================================

    clearSelectedHsnSac: (state) => {
      state.selectedHsnSac = null;
    },

    // ==========================================================
    // RESET STATE
    // ==========================================================

    resetHsnSacState: () => initialState,
  },

  extraReducers: (builder) => {
    // ==========================================================
    // FETCH ALL HSN / SAC
    // ==========================================================

    builder
      .addCase(fetchHsnSac.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchHsnSac.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hsnSacList = action.payload || [];
      })

      .addCase(fetchHsnSac.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch HSN/SAC.";
      });

    // ==========================================================
    // FETCH HSN / SAC BY ID
    // ==========================================================

    builder
      .addCase(fetchHsnSacById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchHsnSacById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedHsnSac = action.payload || null;
      })

      .addCase(fetchHsnSacById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch HSN/SAC.";
      });

    // ==========================================================
    // CREATE HSN / SAC
    // ==========================================================

    builder
      .addCase(createHsnSac.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createHsnSac.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.hsnSacList.unshift(action.payload);
        }
      })

      .addCase(createHsnSac.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || "Failed to create HSN/SAC.";
      });

    // ==========================================================
    // UPDATE HSN / SAC
    // ==========================================================

    builder
      .addCase(updateHsnSac.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateHsnSac.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedHsnSac = action.payload;

        if (!updatedHsnSac?._id) {
          return;
        }

        const index = state.hsnSacList.findIndex(
          (item) => item._id === updatedHsnSac._id,
        );

        if (index !== -1) {
          state.hsnSacList[index] = updatedHsnSac;
        }

        if (state.selectedHsnSac?._id === updatedHsnSac._id) {
          state.selectedHsnSac = updatedHsnSac;
        }
      })

      .addCase(updateHsnSac.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload || "Failed to update HSN/SAC.";
      });

    // ==========================================================
    // DELETE HSN / SAC
    // ==========================================================

    builder
      .addCase(deleteHsnSac.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteHsnSac.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.hsnSacList = state.hsnSacList.filter(
          (item) => item._id !== deletedId,
        );

        if (state.selectedHsnSac?._id === deletedId) {
          state.selectedHsnSac = null;
        }
      })

      .addCase(deleteHsnSac.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete HSN/SAC.";
      });
  },
});

export const { clearHsnSacError, clearSelectedHsnSac, resetHsnSacState } =
  hsnSacSlice.actions;

export default hsnSacSlice.reducer;
