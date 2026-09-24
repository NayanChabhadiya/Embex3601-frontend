export const selectProducts = (state) => state.product?.products ?? [];

export const selectSelectedProduct = (state) =>
  state.product?.selectedProduct ?? null;

export const selectProductStatus = (state) => state.product?.status ?? "idle";

export const selectProductError = (state) => state.product?.error ?? null;

export const selectProductLoading = (state) =>
  state.product?.status === "loading";

export const selectProductById = (state, productId) =>
  state.product?.products?.find((product) => product._id === productId) ?? null;
