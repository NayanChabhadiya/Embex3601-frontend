// ============================================================
// PARTNER CATEGORY STATE
// ============================================================

export const selectPartnerCategoryState = (state) => state.partnerCategory;

// ============================================================
// PARTNER CATEGORIES
// ============================================================

export const selectPartnerCategories = (state) =>
  state.partnerCategory?.partnerCategories ?? [];

// ============================================================
// SELECTED PARTNER CATEGORY
// ============================================================

export const selectSelectedPartnerCategory = (state) =>
  state.partnerCategory?.selectedPartnerCategory ?? null;

// ============================================================
// STATUS
// ============================================================

export const selectPartnerCategoryStatus = (state) =>
  state.partnerCategory?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectPartnerCategoryCreateStatus = (state) =>
  state.partnerCategory?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectPartnerCategoryUpdateStatus = (state) =>
  state.partnerCategory?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectPartnerCategoryDeleteStatus = (state) =>
  state.partnerCategory?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectPartnerCategoryError = (state) =>
  state.partnerCategory?.error ?? null;
