// =============================================================================
// Account Selectors
// =============================================================================

const selectAccountState = (state) => state.account;

// =============================================================================
// Account List
// =============================================================================

export const selectAccounts = (state) => selectAccountState(state).accounts;

export const selectCurrentAccount = (state) =>
  selectAccountState(state).currentAccount;

// =============================================================================
// Pagination
// =============================================================================

export const selectAccountPagination = (state) =>
  selectAccountState(state).pagination;

// =============================================================================
// List Status
// =============================================================================

export const selectAccountListStatus = (state) =>
  selectAccountState(state).listStatus;

export const selectIsAccountListLoading = (state) =>
  selectAccountState(state).listStatus === "loading";

// =============================================================================
// Create Status
// =============================================================================

export const selectAccountCreateStatus = (state) =>
  selectAccountState(state).createStatus;

export const selectIsAccountCreating = (state) =>
  selectAccountState(state).createStatus === "loading";

export const selectAccountCreateSuccess = (state) =>
  selectAccountState(state).createSuccess;

// =============================================================================
// Errors
// =============================================================================

export const selectAccountListError = (state) =>
  selectAccountState(state).listError;

export const selectAccountCreateError = (state) =>
  selectAccountState(state).createError;

// =============================================================================
// Export
// =============================================================================

export default selectAccountState;
