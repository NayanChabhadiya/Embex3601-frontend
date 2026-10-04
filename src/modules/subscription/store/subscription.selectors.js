// --------------------------------------------------------------------------
// Subscription State Selector
// --------------------------------------------------------------------------

const selectSubscriptionState = (state) => state.subscription;

// --------------------------------------------------------------------------
// Active Subscription
// --------------------------------------------------------------------------

export const selectActiveSubscription = (state) =>
  selectSubscriptionState(state).activeSubscription;

export const selectActiveSubscriptionLoading = (state) =>
  selectSubscriptionState(state).activeLoading;

export const selectActiveSubscriptionError = (state) =>
  selectSubscriptionState(state).activeError;

// --------------------------------------------------------------------------
// Create Subscription
// --------------------------------------------------------------------------

export const selectCreatedSubscription = (state) =>
  selectSubscriptionState(state).createdSubscription;

export const selectCreateSubscriptionLoading = (state) =>
  selectSubscriptionState(state).createLoading;

export const selectCreateSubscriptionError = (state) =>
  selectSubscriptionState(state).createError;

// --------------------------------------------------------------------------
// Default Export
// --------------------------------------------------------------------------

const subscriptionSelectors = Object.freeze({
  selectActiveSubscription,
  selectActiveSubscriptionLoading,
  selectActiveSubscriptionError,
  selectCreatedSubscription,
  selectCreateSubscriptionLoading,
  selectCreateSubscriptionError,
});

export default subscriptionSelectors;
