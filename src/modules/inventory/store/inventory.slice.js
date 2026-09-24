import { createSlice } from "@reduxjs/toolkit";

import {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "./inventory.thunks.js";

const initialState = {
  inventories: [],
  selectedInventory: null,
  status: "idle",
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",

  initialState,

  reducers: {
    clearSelectedInventory: (state) => {
      state.selectedInventory = null;
    },

    clearInventoryError: (state) => {
      state.error = null;
    },

    resetInventoryState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // ========================================================
      // CREATE INVENTORY
      // ========================================================

      .addCase(createInventory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const inventory = action.payload?.data ?? action.payload;

        if (inventory) {
          state.inventories.unshift(inventory);
          state.selectedInventory = inventory;
        }
      })

      .addCase(createInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create inventory";
      })

      // ========================================================
      // GET INVENTORIES
      // ========================================================

      .addCase(getInventories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getInventories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const inventories = action.payload?.data ?? action.payload;

        state.inventories = Array.isArray(inventories) ? inventories : [];
      })

      .addCase(getInventories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch inventories";
      })

      // ========================================================
      // GET INVENTORY BY ID
      // ========================================================

      .addCase(getInventoryById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getInventoryById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        state.selectedInventory = action.payload?.data ?? action.payload;
      })

      .addCase(getInventoryById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch inventory";
      })

      // ========================================================
      // UPDATE INVENTORY
      // ========================================================

      .addCase(updateInventory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const updatedInventory = action.payload?.data ?? action.payload;

        if (!updatedInventory) {
          return;
        }

        const index = state.inventories.findIndex(
          (inventory) => inventory._id === updatedInventory._id,
        );

        if (index !== -1) {
          state.inventories[index] = updatedInventory;
        }

        state.selectedInventory = updatedInventory;
      })

      .addCase(updateInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update inventory";
      })

      // ========================================================
      // DELETE INVENTORY
      // ========================================================

      .addCase(deleteInventory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const deletedId = action.payload?.id;

        state.inventories = state.inventories.filter(
          (inventory) => inventory._id !== deletedId,
        );

        if (state.selectedInventory?._id === deletedId) {
          state.selectedInventory = null;
        }
      })

      .addCase(deleteInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete inventory";
      });
  },
});

export const {
  clearSelectedInventory,
  clearInventoryError,
  resetInventoryState,
} = inventorySlice.actions;

export default inventorySlice.reducer;
