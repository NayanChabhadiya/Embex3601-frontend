export const selectAccountingState = (state) => state.accounting;

export const selectAccountingTransactions = (state) =>
  state.accounting?.transactions || [];

export const selectAccountingTransaction = (state) =>
  state.accounting?.selectedTransaction || null;

export const selectAccountingStatus = (state) =>
  state.accounting?.status || "idle";

export const selectAccountingDetailStatus = (state) =>
  state.accounting?.detailStatus || "idle";

export const selectAccountingMutationStatus = (state) =>
  state.accounting?.mutationStatus || "idle";

export const selectAccountingError = (state) => state.accounting?.error || null;
