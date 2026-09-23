// ============================================================
// BANK ACCOUNT SELECTORS
// ============================================================

const selectBankAccountState = (state) => state.bankAccount || {};

// ============================================================
// LIST
// ============================================================

export const selectBankAccounts = (state) =>
  selectBankAccountState(state).items || [];

// ============================================================
// SELECTED BANK ACCOUNT
// ============================================================

export const selectSelectedBankAccount = (state) =>
  selectBankAccountState(state).selected || null;

// ============================================================
// STATUS
// ============================================================

export const selectBankAccountStatus = (state) =>
  selectBankAccountState(state).status || "idle";

export const selectBankAccountDetailsStatus = (state) =>
  selectBankAccountState(state).detailsStatus || "idle";

export const selectBankAccountMutationStatus = (state) =>
  selectBankAccountState(state).mutationStatus || "idle";

// ============================================================
// LOADING
// ============================================================

export const selectBankAccountsLoading = (state) =>
  selectBankAccountStatus(state) === "loading";

export const selectBankAccountDetailsLoading = (state) =>
  selectBankAccountDetailsStatus(state) === "loading";

export const selectBankAccountMutationLoading = (state) =>
  selectBankAccountMutationStatus(state) === "loading";

// ============================================================
// ERRORS
// ============================================================

export const selectBankAccountError = (state) =>
  selectBankAccountState(state).error || null;

export const selectBankAccountDetailsError = (state) =>
  selectBankAccountState(state).detailsError || null;

export const selectBankAccountMutationError = (state) =>
  selectBankAccountState(state).mutationError || null;

// ============================================================
// LAST OPERATIONS
// ============================================================

export const selectLastCreatedBankAccount = (state) =>
  selectBankAccountState(state).lastCreated || null;

export const selectLastUpdatedBankAccount = (state) =>
  selectBankAccountState(state).lastUpdated || null;

export const selectLastDeletedBankAccountId = (state) =>
  selectBankAccountState(state).lastDeletedId || null;

// ============================================================
// DERIVED SELECTORS
// ============================================================

export const selectBankAccountCount = (state) =>
  selectBankAccounts(state).length;

export const selectActiveBankAccounts = (state) =>
  selectBankAccounts(state).filter(
    (bankAccount) =>
      bankAccount?.status === "ACTIVE" && bankAccount?.isDeleted !== true,
  );

export const selectInactiveBankAccounts = (state) =>
  selectBankAccounts(state).filter(
    (bankAccount) =>
      bankAccount?.status === "INACTIVE" && bankAccount?.isDeleted !== true,
  );

// ============================================================
// COMPANY FILTER
// ============================================================

export const selectBankAccountsByCompany = (state, companyId) =>
  selectBankAccounts(state).filter(
    (bankAccount) =>
      String(bankAccount?.companyId?._id || bankAccount?.companyId) ===
      String(companyId),
  );

// ============================================================
// BRANCH FILTER
// ============================================================

export const selectBankAccountsByBranch = (state, branchId) =>
  selectBankAccounts(state).filter(
    (bankAccount) =>
      String(bankAccount?.branchId?._id || bankAccount?.branchId) ===
      String(branchId),
  );

// ============================================================
// DEFAULT BANK ACCOUNT
// ============================================================

export const selectDefaultBankAccount = (state) =>
  selectBankAccounts(state).find(
    (bankAccount) =>
      bankAccount?.isDefault === true && bankAccount?.isDeleted !== true,
  ) || null;
