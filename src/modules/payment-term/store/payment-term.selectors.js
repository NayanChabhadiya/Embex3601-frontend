// ============================================================
// PAYMENT TERM SELECTORS
// ============================================================

// Root selector
export const selectPaymentTermState = (state) => state.paymentTerm;

// ============================================================
// ALL PAYMENT TERMS
// ============================================================

export const selectPaymentTerms = (state) => state.paymentTerm.items;

// ============================================================
// SELECTED PAYMENT TERM
// ============================================================

export const selectSelectedPaymentTerm = (state) =>
  state.paymentTerm.selectedPaymentTerm;

// ============================================================
// STATUS
// ============================================================

export const selectPaymentTermStatus = (state) => state.paymentTerm.status;

// ============================================================
// ERROR
// ============================================================

export const selectPaymentTermError = (state) => state.paymentTerm.error;

// ============================================================
// LOADING
// ============================================================

export const selectPaymentTermsLoading = (state) =>
  state.paymentTerm.status === "loading";

// ============================================================
// HAS PAYMENT TERMS
// ============================================================

export const selectHasPaymentTerms = (state) =>
  state.paymentTerm.items.length > 0;
