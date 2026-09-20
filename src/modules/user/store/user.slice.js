import { createSlice } from "@reduxjs/toolkit";

import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./user.thunks.js";

const initialState = {
  users: [],
  selectedUser: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================================================
      // Fetch Users
      // =========================================================

      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload ?? [];
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Fetch User By ID
      // =========================================================

      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedUser = action.payload ?? null;
      })

      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Create User
      // =========================================================

      .addCase(createUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.users.unshift(action.payload);
        }
      })

      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Update User
      // =========================================================

      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedUser = action.payload;

        if (!updatedUser) {
          return;
        }

        const index = state.users.findIndex(
          (user) => user._id === updatedUser._id,
        );

        if (index !== -1) {
          state.users[index] = updatedUser;
        }

        if (state.selectedUser?._id === updatedUser._id) {
          state.selectedUser = updatedUser;
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Delete User
      // =========================================================

      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.users = state.users.filter((user) => user._id !== deletedId);

        if (state.selectedUser?._id === deletedId) {
          state.selectedUser = null;
        }
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearSelectedUser } = userSlice.actions;

export default userSlice.reducer;
