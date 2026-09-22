// ============================================================
// COMPANY STATE
// ============================================================

export const selectCompanyState = (state) => state.company;

// ============================================================
// COMPANIES
// ============================================================

export const selectCompanies = (state) => state.company?.companies ?? [];

// ============================================================
// SELECTED COMPANY
// ============================================================

export const selectSelectedCompany = (state) =>
  state.company?.selectedCompany ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectCompanyStatus = (state) => state.company?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectCompanyCreateStatus = (state) =>
  state.company?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectCompanyUpdateStatus = (state) =>
  state.company?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectCompanyDeleteStatus = (state) =>
  state.company?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectCompanyError = (state) => state.company?.error ?? null;
