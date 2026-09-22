// ============================================================
// FINANCIAL YEAR STATE
// ============================================================

export const selectFinancialYearState = (state) => state.financialYear;

// ============================================================
// FINANCIAL YEARS
// ============================================================

export const selectFinancialYears = (state) =>
  state.financialYear?.financialYears ?? [];

// ============================================================
// SELECTED FINANCIAL YEAR
// ============================================================

export const selectSelectedFinancialYear = (state) =>
  state.financialYear?.selectedFinancialYear ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectFinancialYearStatus = (state) =>
  state.financialYear?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectFinancialYearCreateStatus = (state) =>
  state.financialYear?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectFinancialYearUpdateStatus = (state) =>
  state.financialYear?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectFinancialYearDeleteStatus = (state) =>
  state.financialYear?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectFinancialYearError = (state) =>
  state.financialYear?.error ?? null;
