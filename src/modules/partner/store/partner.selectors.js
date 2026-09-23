// ============================================================
// PARTNER STATE
// ============================================================

export const selectPartnerState = (state) => state.partner;

// ============================================================
// PARTNERS
// ============================================================

export const selectPartners = (state) => state.partner?.partners ?? [];

// ============================================================
// SELECTED PARTNER
// ============================================================

export const selectSelectedPartner = (state) =>
  state.partner?.selectedPartner ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectPartnerStatus = (state) => state.partner?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectPartnerCreateStatus = (state) =>
  state.partner?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectPartnerUpdateStatus = (state) =>
  state.partner?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectPartnerDeleteStatus = (state) =>
  state.partner?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectPartnerError = (state) => state.partner?.error ?? null;
