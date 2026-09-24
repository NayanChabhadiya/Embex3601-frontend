export const selectInventories = (state) => state.inventory?.inventories ?? [];

export const selectSelectedInventory = (state) =>
  state.inventory?.selectedInventory ?? null;

export const selectInventoryStatus = (state) =>
  state.inventory?.status ?? "idle";

export const selectInventoryError = (state) => state.inventory?.error ?? null;

export const selectInventoryLoading = (state) =>
  state.inventory?.status === "loading";

export const selectInventoryById = (state, inventoryId) =>
  state.inventory?.inventories?.find(
    (inventory) => inventory._id === inventoryId,
  ) ?? null;
