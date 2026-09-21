// ============================================================
// BANK SELECTORS
// ============================================================

// Bank State
export const selectBankState = (state) => state.bank;

// All Banks
export const selectBanks = (state) => state.bank?.banks ?? [];

// Selected Bank
export const selectSelectedBank = (state) => state.bank?.selectedBank ?? null;

// Fetch Status
export const selectBankStatus = (state) => state.bank?.status ?? "idle";

// Create Status
export const selectBankCreateStatus = (state) =>
  state.bank?.createStatus ?? "idle";

// Update Status
export const selectBankUpdateStatus = (state) =>
  state.bank?.updateStatus ?? "idle";

// Delete Status
export const selectBankDeleteStatus = (state) =>
  state.bank?.deleteStatus ?? "idle";

// Error
export const selectBankError = (state) => state.bank?.error ?? null;
