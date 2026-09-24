// ============================================================
// SALES STATE
// ============================================================

const selectSalesState = (state) => state.sales;

// ============================================================
// SALES LIST
// ============================================================

export const selectSales = (state) => selectSalesState(state)?.sales || [];

// ============================================================
// SELECTED SALE
// ============================================================

export const selectSelectedSale = (state) =>
  selectSalesState(state)?.selectedSale || null;

// ============================================================
// STATUS
// ============================================================

export const selectSalesStatus = (state) =>
  selectSalesState(state)?.status || "idle";

// ============================================================
// SUBMIT STATUS
// ============================================================

export const selectSalesSubmitStatus = (state) =>
  selectSalesState(state)?.submitStatus || "idle";

// ============================================================
// ERROR
// ============================================================

export const selectSalesError = (state) =>
  selectSalesState(state)?.error || null;
