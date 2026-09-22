// ============================================================
// PURCHASE COMPANY STATE
// ============================================================

export const selectPurchaseCompanyState = (state) => state.purchaseCompany;

// ============================================================
// PURCHASE COMPANIES
// ============================================================

export const selectPurchaseCompanies = (state) =>
  state.purchaseCompany?.purchaseCompanies ?? [];

// ============================================================
// SELECTED PURCHASE COMPANY
// ============================================================

export const selectSelectedPurchaseCompany = (state) =>
  state.purchaseCompany?.selectedPurchaseCompany ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectPurchaseCompanyStatus = (state) =>
  state.purchaseCompany?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectPurchaseCompanyCreateStatus = (state) =>
  state.purchaseCompany?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectPurchaseCompanyUpdateStatus = (state) =>
  state.purchaseCompany?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectPurchaseCompanyDeleteStatus = (state) =>
  state.purchaseCompany?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectPurchaseCompanyError = (state) =>
  state.purchaseCompany?.error ?? null;
