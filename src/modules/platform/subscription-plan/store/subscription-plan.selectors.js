// --------------------------------------------------------------------------
// Subscription Plan State Selector
// --------------------------------------------------------------------------

const selectSubscriptionPlanState = (state) => state.subscriptionPlan;

// --------------------------------------------------------------------------
// Subscription Plans List
// --------------------------------------------------------------------------

export const selectSubscriptionPlans = (state) =>
  selectSubscriptionPlanState(state).subscriptionPlans;

export const selectSubscriptionPlanPagination = (state) =>
  selectSubscriptionPlanState(state).pagination;

export const selectSubscriptionPlanListLoading = (state) =>
  selectSubscriptionPlanState(state).listLoading;

export const selectSubscriptionPlanListError = (state) =>
  selectSubscriptionPlanState(state).listError;

// --------------------------------------------------------------------------
// Create Subscription Plan
// --------------------------------------------------------------------------

export const selectCreatedSubscriptionPlan = (state) =>
  selectSubscriptionPlanState(state).createdSubscriptionPlan;

export const selectCreateSubscriptionPlanLoading = (state) =>
  selectSubscriptionPlanState(state).createLoading;

export const selectCreateSubscriptionPlanError = (state) =>
  selectSubscriptionPlanState(state).createError;

// --------------------------------------------------------------------------
// Default Export
// --------------------------------------------------------------------------

const subscriptionPlanSelectors = Object.freeze({
  selectSubscriptionPlans,
  selectSubscriptionPlanPagination,
  selectSubscriptionPlanListLoading,
  selectSubscriptionPlanListError,
  selectCreatedSubscriptionPlan,
  selectCreateSubscriptionPlanLoading,
  selectCreateSubscriptionPlanError,
});

export default subscriptionPlanSelectors;
