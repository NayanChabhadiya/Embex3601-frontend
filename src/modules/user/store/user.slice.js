import { createSlice } from "@reduxjs/toolkit";

import { createUser, getUsers, getUserById } from "./user.thunks.js";

// --------------------------------------------------------------------------
// Initial State
// --------------------------------------------------------------------------

const initialState = {
  // ------------------------------------------------------------------------
  // Users List
  // ------------------------------------------------------------------------

  users: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  listLoading: false,
  listError: null,

  // ------------------------------------------------------------------------
  // Selected User
  // ------------------------------------------------------------------------

  selectedUser: null,

  detailLoading: false,
  detailError: null,

  // ------------------------------------------------------------------------
  // Create User
  // ------------------------------------------------------------------------

  createLoading: false,
  createError: null,
  createdUser: null,
};

// --------------------------------------------------------------------------
// User Slice
// --------------------------------------------------------------------------

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // ----------------------------------------------------------------------
    // Clear Selected User
    // ----------------------------------------------------------------------

    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.detailError = null;
    },

    // ----------------------------------------------------------------------
    // Clear Created User
    // ----------------------------------------------------------------------

    clearCreatedUser: (state) => {
      state.createdUser = null;
      state.createError = null;
    },

    // ----------------------------------------------------------------------
    // Clear User Errors
    // ----------------------------------------------------------------------

    clearUserErrors: (state) => {
      state.listError = null;
      state.detailError = null;
      state.createError = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================================================
    // Create User
    // ======================================================================

    builder
      .addCase(createUser.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createdUser = null;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createdUser = action.payload?.data || action.payload || null;
      })

      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create user.";
      });

    // ======================================================================
    // Get Users
    // ======================================================================

    builder
      .addCase(getUsers.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })

      .addCase(getUsers.fulfilled, (state, action) => {
        state.listLoading = false;

        const response = action.payload || {};

        state.users = response.data || [];

        state.pagination = response.meta || state.pagination;
      })

      .addCase(getUsers.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload || "Failed to fetch users.";
      });

    // ======================================================================
    // Get User By ID
    // ======================================================================

    builder
      .addCase(getUserById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.detailLoading = false;

        const response = action.payload || {};

        state.selectedUser = response.data || response || null;
      })

      .addCase(getUserById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || "Failed to fetch user.";
      });
  },
});

// --------------------------------------------------------------------------
// Actions
// --------------------------------------------------------------------------

export const { clearSelectedUser, clearCreatedUser, clearUserErrors } =
  userSlice.actions;

// --------------------------------------------------------------------------
// Reducer
// --------------------------------------------------------------------------

export default userSlice.reducer;
