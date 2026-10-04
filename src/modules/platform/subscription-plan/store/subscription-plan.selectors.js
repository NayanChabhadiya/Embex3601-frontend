// --------------------------------------------------------------------------
// Subscription Plan State Selector
// --------------------------------------------------------------------------

const selectSubscriptionPlanState = (state) => state.subscriptionPlan;

// --------------------------------------------------------------------------
// Subscription Plans List - Platform Admin
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
// Available Subscription Plans - Customer
// --------------------------------------------------------------------------

export const selectAvailableSubscriptionPlans = (state) =>
  selectSubscriptionPlanState(state).availableSubscriptionPlans;

export const selectAvailableSubscriptionPlanPagination = (state) =>
  selectSubscriptionPlanState(state).availablePagination;

export const selectAvailableSubscriptionPlanLoading = (state) =>
  selectSubscriptionPlanState(state).availableLoading;

export const selectAvailableSubscriptionPlanError = (state) =>
  selectSubscriptionPlanState(state).availableError;

// --------------------------------------------------------------------------
// Create Subscription Plan - Platform Admin
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

  selectAvailableSubscriptionPlans,
  selectAvailableSubscriptionPlanPagination,
  selectAvailableSubscriptionPlanLoading,
  selectAvailableSubscriptionPlanError,

  selectCreatedSubscriptionPlan,
  selectCreateSubscriptionPlanLoading,
  selectCreateSubscriptionPlanError,
});

export default subscriptionPlanSelectors;
