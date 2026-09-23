export const selectWarehouseState = (state) =>
  state.warehouse;

export const selectWarehouses = (state) =>
  state.warehouse?.warehouses ?? [];

export const selectSelectedWarehouse = (state) =>
  state.warehouse?.selectedWarehouse ?? null;

export const selectWarehouseStatus = (state) =>
  state.warehouse?.status ?? "idle";

export const selectWarehouseCreateStatus = (state) =>
  state.warehouse?.createStatus ?? "idle";

export const selectWarehouseUpdateStatus = (state) =>
  state.warehouse?.updateStatus ?? "idle";

export const selectWarehouseDeleteStatus = (state) =>
  state.warehouse?.deleteStatus ?? "idle";

export const selectWarehouseError = (state) =>
  state.warehouse?.error ?? null;

export const selectWarehouseCreateError = (state) =>
  state.warehouse?.createError ?? null;

export const selectWarehouseUpdateError = (state) =>
  state.warehouse?.updateError ?? null;

export const selectWarehouseDeleteError = (state) =>
  state.warehouse?.deleteError ?? null;

export const selectWarehouseTotal = (state) =>
  state.warehouse?.total ?? 0;

export const selectIsWarehousesLoading = (state) =>
  state.warehouse?.status === "loading";

export const selectIsWarehouseCreating = (state) =>
  state.warehouse?.createStatus === "loading";

export const selectIsWarehouseUpdating = (state) =>
  state.warehouse?.updateStatus === "loading";

export const selectIsWarehouseDeleting = (state) =>
  state.warehouse?.deleteStatus === "loading";