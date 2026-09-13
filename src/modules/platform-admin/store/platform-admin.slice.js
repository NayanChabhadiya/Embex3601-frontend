import { createSlice } from "@reduxjs/toolkit";
import { fetchPlatformAdminAccess } from "./platform-admin.thunks.js";

const initialState = Object.freeze({
  access: null,
  status: "idle",
  error: null,
});

const platformAdminSlice = createSlice({
  name: "platformAdmin",
  initialState,

  reducers: {
    resetPlatformAdmin(state) {
      state.access = null;
      state.status = "idle";
      state.error = null;
    },

    clearPlatformAdminError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformAdminAccess.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPlatformAdminAccess.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.access = action.payload ?? null;
        state.error = null;
      })

      .addCase(fetchPlatformAdminAccess.rejected, (state, action) => {
        state.status = "failed";
        state.access = null;
        state.error =
          action.payload ?? "Unable to resolve Platform Admin access.";
      });
  },
});

export const { resetPlatformAdmin, clearPlatformAdminError } =
  platformAdminSlice.actions;

export default platformAdminSlice.reducer;
