const selectSubscriptionPlanState = (state) => state.subscriptionPlans;

export const selectSubscriptionPlans = (state) =>
  selectSubscriptionPlanState(state).plans;

export const selectSubscriptionPlansStatus = (state) =>
  selectSubscriptionPlanState(state).status;

export const selectSubscriptionPlansError = (state) =>
  selectSubscriptionPlanState(state).error;

export const selectSubscriptionPlansLoading = (state) =>
  selectSubscriptionPlanState(state).status === "loading";

export const selectSubscriptionPlansLoaded = (state) =>
  selectSubscriptionPlanState(state).status === "succeeded";

export const selectSubscriptionPlansMeta = (state) =>
  selectSubscriptionPlanState(state).meta;
