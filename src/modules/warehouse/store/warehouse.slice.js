import { createSlice } from "@reduxjs/toolkit";

import {
  fetchWarehouses,
  fetchWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "./warehouse.thunks";

const initialState = {
  warehouses: [],
  selectedWarehouse: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
  createError: null,
  updateError: null,
  deleteError: null,

  total: 0,
};

const warehouseSlice = createSlice({
  name: "warehouse",

  initialState,

  reducers: {
    clearWarehouseError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },

    clearSelectedWarehouse: (state) => {
      state.selectedWarehouse = null;
    },

    resetWarehouseState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // ============================================================
      // FETCH ALL WAREHOUSES
      // ============================================================

      .addCase(fetchWarehouses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.status = "succeeded";

        const response = action.payload;

        /*
         * Supports common API response structures:
         *
         * {
         *   data: [...]
         * }
         *
         * OR
         *
         * {
         *   data: {
         *     items: [...]
         *     total: 10
         *   }
         * }
         */

        if (Array.isArray(response?.data)) {
          state.warehouses = response.data;
          state.total = response.data.length;
        } else if (Array.isArray(response?.data?.items)) {
          state.warehouses = response.data.items;
          state.total = response.data.total ?? response.data.items.length;
        } else if (Array.isArray(response)) {
          state.warehouses = response;
          state.total = response.length;
        } else {
          state.warehouses = [];
          state.total = 0;
        }

        state.error = null;
      })

      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch warehouses";
      })

      // ============================================================
      // FETCH WAREHOUSE BY ID
      // ============================================================

      .addCase(fetchWarehouseById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchWarehouseById.fulfilled, (state, action) => {
        state.status = "succeeded";

        const response = action.payload;

        state.selectedWarehouse = response?.data ?? response ?? null;

        state.error = null;
      })

      .addCase(fetchWarehouseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch warehouse";
      })

      // ============================================================
      // CREATE WAREHOUSE
      // ============================================================

      .addCase(createWarehouse.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })

      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        const response = action.payload;

        const createdWarehouse = response?.data ?? response ?? null;

        if (createdWarehouse) {
          state.warehouses.unshift(createdWarehouse);
          state.total += 1;
        }

        state.createError = null;
      })

      .addCase(createWarehouse.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create warehouse";
      })

      // ============================================================
      // UPDATE WAREHOUSE
      // ============================================================

      .addCase(updateWarehouse.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })

      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const response = action.payload;

        const updatedWarehouse = response?.data ?? response ?? null;

        if (updatedWarehouse?._id) {
          const index = state.warehouses.findIndex(
            (warehouse) => warehouse._id === updatedWarehouse._id,
          );

          if (index !== -1) {
            state.warehouses[index] = updatedWarehouse;
          }

          if (state.selectedWarehouse?._id === updatedWarehouse._id) {
            state.selectedWarehouse = updatedWarehouse;
          }
        }

        state.updateError = null;
      })

      .addCase(updateWarehouse.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update warehouse";
      })

      // ============================================================
      // DELETE WAREHOUSE
      // ============================================================

      .addCase(deleteWarehouse.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })

      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (deletedId) {
          state.warehouses = state.warehouses.filter(
            (warehouse) => warehouse._id !== deletedId,
          );

          state.total = Math.max(0, state.total - 1);

          if (state.selectedWarehouse?._id === deletedId) {
            state.selectedWarehouse = null;
          }
        }

        state.deleteError = null;
      })

      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete warehouse";
      });
  },
});

export const {
  clearWarehouseError,
  clearSelectedWarehouse,
  resetWarehouseState,
} = warehouseSlice.actions;

export default warehouseSlice.reducer;
