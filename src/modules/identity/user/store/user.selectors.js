// --------------------------------------------------------------------------
// User State Selector
// --------------------------------------------------------------------------

const selectUserState = (state) => state.user;

// --------------------------------------------------------------------------
// Users List
// --------------------------------------------------------------------------

export const selectUsers = (state) => selectUserState(state).users;

export const selectUserPagination = (state) =>
  selectUserState(state).pagination;

export const selectUserListLoading = (state) =>
  selectUserState(state).listLoading;

export const selectUserListError = (state) => selectUserState(state).listError;

// --------------------------------------------------------------------------
// Selected User
// --------------------------------------------------------------------------

export const selectSelectedUser = (state) =>
  selectUserState(state).selectedUser;

export const selectUserDetailLoading = (state) =>
  selectUserState(state).detailLoading;

export const selectUserDetailError = (state) =>
  selectUserState(state).detailError;

// --------------------------------------------------------------------------
// Create User
// --------------------------------------------------------------------------

export const selectCreatedUser = (state) => selectUserState(state).createdUser;

export const selectCreateUserLoading = (state) =>
  selectUserState(state).createLoading;

export const selectCreateUserError = (state) =>
  selectUserState(state).createError;

// --------------------------------------------------------------------------
// Default Export
// --------------------------------------------------------------------------

const userSelectors = Object.freeze({
  selectUsers,
  selectUserPagination,
  selectUserListLoading,
  selectUserListError,
  selectSelectedUser,
  selectUserDetailLoading,
  selectUserDetailError,
  selectCreatedUser,
  selectCreateUserLoading,
  selectCreateUserError,
});

export default userSelectors;
