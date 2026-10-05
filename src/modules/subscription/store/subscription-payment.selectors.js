// =============================================================================
// Subscription Payment Selectors
// =============================================================================

const selectSubscriptionPaymentState = (state) =>
  state.subscriptionPayment;

// =============================================================================
// Payment Selectors
// =============================================================================

export const selectCurrentPayment = (state) =>
  selectSubscriptionPaymentState(state).currentPayment;

export const selectCreatedPayment = (state) =>
  selectSubscriptionPaymentState(state).createdPayment;

export const selectPaymentOrder = (state) =>
  selectSubscriptionPaymentState(state).paymentOrder;

// =============================================================================
// Create Order Selectors
// =============================================================================

export const selectCreateOrderLoading = (state) =>
  selectSubscriptionPaymentState(state).createOrderLoading;

export const selectCreateOrderError = (state) =>
  selectSubscriptionPaymentState(state).createOrderError;

// =============================================================================
// Customer Payment Verification Selectors
// =============================================================================

export const selectVerifyPaymentLoading = (state) =>
  selectSubscriptionPaymentState(state).verifyLoading;

export const selectVerifyPaymentError = (state) =>
  selectSubscriptionPaymentState(state).verifyError;

export const selectPaymentVerified = (state) =>
  selectSubscriptionPaymentState(state).paymentVerified;

// =============================================================================
// Platform Admin Manual Payment Verification Selectors
// =============================================================================

export const selectManualVerifyPaymentLoading = (state) =>
  selectSubscriptionPaymentState(state).manualVerifyLoading;

export const selectManualVerifyPaymentError = (state) =>
  selectSubscriptionPaymentState(state).manualVerifyError;

export const selectManualPaymentVerified = (state) =>
  selectSubscriptionPaymentState(state).manualPaymentVerified;

// =============================================================================
// Fetch Selectors
// =============================================================================

export const selectPaymentFetchLoading = (state) =>
  selectSubscriptionPaymentState(state).fetchLoading;

export const selectPaymentFetchError = (state) =>
  selectSubscriptionPaymentState(state).fetchError;

// =============================================================================
// Default Selector Object
// =============================================================================

const subscriptionPaymentSelectors = Object.freeze({
  selectCurrentPayment,
  selectCreatedPayment,
  selectPaymentOrder,

  selectCreateOrderLoading,
  selectCreateOrderError,

  selectVerifyPaymentLoading,
  selectVerifyPaymentError,
  selectPaymentVerified,

  selectManualVerifyPaymentLoading,
  selectManualVerifyPaymentError,
  selectManualPaymentVerified,

  selectPaymentFetchLoading,
  selectPaymentFetchError,
});

export default subscriptionPaymentSelectors;