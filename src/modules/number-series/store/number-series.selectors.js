// ============================================================
// NUMBER SERIES STATE
// ============================================================

export const selectNumberSeriesState = (state) => state.numberSeries;

// ============================================================
// NUMBER SERIES LIST
// ============================================================

export const selectNumberSeries = (state) =>
  state.numberSeries?.numberSeries ?? [];

// ============================================================
// SELECTED NUMBER SERIES
// ============================================================

export const selectSelectedNumberSeries = (state) =>
  state.numberSeries?.selectedNumberSeries ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectNumberSeriesStatus = (state) =>
  state.numberSeries?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectNumberSeriesCreateStatus = (state) =>
  state.numberSeries?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectNumberSeriesUpdateStatus = (state) =>
  state.numberSeries?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectNumberSeriesDeleteStatus = (state) =>
  state.numberSeries?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectNumberSeriesError = (state) =>
  state.numberSeries?.error ?? null;
