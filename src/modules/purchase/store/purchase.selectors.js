export const selectPurchases = (state) => state.purchase?.purchases ?? [];

export const selectSelectedPurchase = (state) =>
  state.purchase?.selectedPurchase ?? null;

export const selectPurchaseStatus = (state) => state.purchase?.status ?? "idle";

export const selectPurchaseError = (state) => state.purchase?.error ?? null;

export const selectPurchaseLoading = (state) =>
  state.purchase?.status === "loading";

export const selectPurchaseById = (state, purchaseId) =>
  state.purchase?.purchases?.find((purchase) => purchase._id === purchaseId) ??
  null;
