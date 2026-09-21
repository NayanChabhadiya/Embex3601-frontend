import { createSlice } from "@reduxjs/toolkit";

import {
  fetchUnits,
  fetchUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "./unit.thunks.js";

const initialState = {
  units: [],
  selectedUnit: null,

  status: "idle",
  selectedStatus: "idle",
  mutationStatus: "idle",

  error: null,
};

const unitSlice = createSlice({
  name: "unit",

  initialState,

  reducers: {
    clearUnitError: (state) => {
      state.error = null;
    },

    clearSelectedUnit: (state) => {
      state.selectedUnit = null;
      state.selectedStatus = "idle";
    },

    resetUnitState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // FETCH ALL UNITS
      // ======================================================

      .addCase(fetchUnits.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.units = action.payload || [];

        state.error = null;
      })

      .addCase(fetchUnits.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch units.";
      })

      // ======================================================
      // FETCH UNIT BY ID
      // ======================================================

      .addCase(fetchUnitById.pending, (state) => {
        state.selectedStatus = "loading";
        state.error = null;
      })

      .addCase(fetchUnitById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";

        state.selectedUnit = action.payload || null;

        state.error = null;
      })

      .addCase(fetchUnitById.rejected, (state, action) => {
        state.selectedStatus = "failed";

        state.error = action.payload || "Failed to fetch unit.";
      })

      // ======================================================
      // CREATE UNIT
      // ======================================================

      .addCase(createUnit.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(createUnit.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        if (action.payload) {
          state.units.unshift(action.payload);
        }

        state.error = null;
      })

      .addCase(createUnit.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error = action.payload || "Failed to create unit.";
      })

      // ======================================================
      // UPDATE UNIT
      // ======================================================

      .addCase(updateUnit.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(updateUnit.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const updatedUnit = action.payload;

        if (!updatedUnit?._id) {
          return;
        }

        const index = state.units.findIndex(
          (unit) => unit._id === updatedUnit._id,
        );

        if (index !== -1) {
          state.units[index] = updatedUnit;
        }

        if (state.selectedUnit?._id === updatedUnit._id) {
          state.selectedUnit = updatedUnit;
        }

        state.error = null;
      })

      .addCase(updateUnit.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error = action.payload || "Failed to update unit.";
      })

      // ======================================================
      // DELETE UNIT
      // ======================================================

      .addCase(deleteUnit.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (deletedId) {
          state.units = state.units.filter((unit) => unit._id !== deletedId);

          if (state.selectedUnit?._id === deletedId) {
            state.selectedUnit = null;
          }
        }

        state.error = null;
      })

      .addCase(deleteUnit.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error = action.payload || "Failed to delete unit.";
      });
  },
});

export const { clearUnitError, clearSelectedUnit, resetUnitState } =
  unitSlice.actions;

export default unitSlice.reducer;
