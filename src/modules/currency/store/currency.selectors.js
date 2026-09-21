// ============================================================
// CURRENCY SELECTORS
// ============================================================

export const selectCurrencies = (state) => state.currency?.items || [];

// ============================================================
// SELECT CURRENCY BY ID
// ============================================================

export const selectCurrencyById = (state, id) =>
  state.currency?.items?.find((currency) => currency._id === id) || null;

// ============================================================
// SELECT SELECTED CURRENCY
// ============================================================

export const selectSelectedCurrency = (state) =>
  state.currency?.selectedCurrency || null;

// ============================================================
// SELECT CURRENCY STATUS
// ============================================================

export const selectCurrencyStatus = (state) => state.currency?.status || "idle";

// ============================================================
// SELECT CURRENCY ERROR
// ============================================================

export const selectCurrencyError = (state) => state.currency?.error || null;

// ============================================================
// SELECT CURRENCY LOADING STATE
// ============================================================

export const selectCurrencyLoading = (state) =>
  state.currency?.status === "loading";
