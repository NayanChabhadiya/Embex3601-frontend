// =============================================================================
// Account Selectors
// =============================================================================

const selectAccountState = (state) => state.account;

// =============================================================================
// Account Data
// =============================================================================

export const selectAccounts = (state) =>
  selectAccountState(state)?.accounts || [];

export const selectSelectedAccount = (state) =>
  selectAccountState(state)?.selectedAccount || null;

// =============================================================================
// Loading State
// =============================================================================

export const selectAccountLoading = (state) =>
  Boolean(selectAccountState(state)?.loading);

export const selectAccountListLoading = (state) =>
  Boolean(selectAccountState(state)?.listLoading);

export const selectAccountDetailsLoading = (state) =>
  Boolean(selectAccountState(state)?.detailsLoading);

export const selectAccountCreateLoading = (state) =>
  Boolean(selectAccountState(state)?.createLoading);

export const selectAccountUpdateLoading = (state) =>
  Boolean(selectAccountState(state)?.updateLoading);

export const selectAccountDeleteLoading = (state) =>
  Boolean(selectAccountState(state)?.deleteLoading);

// =============================================================================
// Error State
// =============================================================================

export const selectAccountError = (state) =>
  selectAccountState(state)?.error || null;

export const selectAccountListError = (state) =>
  selectAccountState(state)?.listError || null;

export const selectAccountDetailsError = (state) =>
  selectAccountState(state)?.detailsError || null;

export const selectAccountCreateError = (state) =>
  selectAccountState(state)?.createError || null;

export const selectAccountUpdateError = (state) =>
  selectAccountState(state)?.updateError || null;

export const selectAccountDeleteError = (state) =>
  selectAccountState(state)?.deleteError || null;

// =============================================================================
// Pagination
// =============================================================================

export const selectAccountPagination = (state) =>
  selectAccountState(state)?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

// =============================================================================
// Filters
// =============================================================================

export const selectAccountFilters = (state) =>
  selectAccountState(state)?.filters || {};

// =============================================================================
// Derived Selectors
// =============================================================================

export const selectHasAccounts = (state) => selectAccounts(state).length > 0;

export const selectAccountCount = (state) => selectAccounts(state).length;

export const selectAccountTotal = (state) =>
  selectAccountPagination(state).total || 0;

export const selectHasNextAccountPage = (state) =>
  Boolean(selectAccountPagination(state).hasNextPage);

export const selectHasPreviousAccountPage = (state) =>
  Boolean(selectAccountPagination(state).hasPreviousPage);

// =============================================================================
// Export
// =============================================================================

const accountSelectors = Object.freeze({
  selectAccounts,
  selectSelectedAccount,

  selectAccountLoading,
  selectAccountListLoading,
  selectAccountDetailsLoading,
  selectAccountCreateLoading,
  selectAccountUpdateLoading,
  selectAccountDeleteLoading,

  selectAccountError,
  selectAccountListError,
  selectAccountDetailsError,
  selectAccountCreateError,
  selectAccountUpdateError,
  selectAccountDeleteError,

  selectAccountPagination,
  selectAccountFilters,

  selectHasAccounts,
  selectAccountCount,
  selectAccountTotal,
  selectHasNextAccountPage,
  selectHasPreviousAccountPage,
});

export default accountSelectors;
