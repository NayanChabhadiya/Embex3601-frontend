// ============================================================
// GST SELECTORS
// ============================================================

// Root GST state
const selectGSTState = (state) => state.gst;

// ============================================================
// GST DOCUMENTS
// ============================================================

export const selectGSTDocuments = (state) =>
  selectGSTState(state)?.documents || [];

// ============================================================
// SELECTED GST DOCUMENT
// ============================================================

export const selectSelectedGST = (state) =>
  selectGSTState(state)?.selectedDocument || null;

// ============================================================
// GST STATUS
// ============================================================

export const selectGSTStatus = (state) =>
  selectGSTState(state)?.status || "idle";

// ============================================================
// GST ERROR
// ============================================================

export const selectGSTError = (state) => selectGSTState(state)?.error || null;

// ============================================================
// GST LOADING
// ============================================================

export const selectGSTLoading = (state) => selectGSTStatus(state) === "loading";
