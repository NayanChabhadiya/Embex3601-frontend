// ============================================================
// PRODUCT CATEGORY STATE
// ============================================================

export const selectProductCategoryState = (state) => state.productCategory;

// ============================================================
// PRODUCT CATEGORIES
// ============================================================

export const selectProductCategories = (state) =>
  state.productCategory?.productCategories ?? [];

// ============================================================
// SELECTED PRODUCT CATEGORY
// ============================================================

export const selectSelectedProductCategory = (state) =>
  state.productCategory?.selectedProductCategory ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectProductCategoryStatus = (state) =>
  state.productCategory?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectProductCategoryCreateStatus = (state) =>
  state.productCategory?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectProductCategoryUpdateStatus = (state) =>
  state.productCategory?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectProductCategoryDeleteStatus = (state) =>
  state.productCategory?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectProductCategoryError = (state) =>
  state.productCategory?.error ?? null;
