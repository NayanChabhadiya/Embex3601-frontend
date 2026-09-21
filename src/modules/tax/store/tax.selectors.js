export const selectTaxState = (state) => state.tax;

export const selectTaxes = (state) => state.tax?.items || [];

export const selectSelectedTax = (state) => state.tax?.selectedTax || null;

export const selectTaxStatus = (state) => state.tax?.status || "idle";

export const selectTaxError = (state) => state.tax?.error || null;

export const selectTaxLoading = (state) => state.tax?.status === "loading";
