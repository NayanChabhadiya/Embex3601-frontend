// =============================================================================
// Customer Subscription Plans Page
// =============================================================================

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  PageContainer,
  PageHeader,
  Button,
  Badge,
  useToast,
} from "../../components/common";

import { getAvailableSubscriptionPlans } from "../platform/subscription-plan/store/subscription-plan.thunks.js";

import {
  selectAvailableSubscriptionPlans,
  selectAvailableSubscriptionPlanLoading,
  selectAvailableSubscriptionPlanError,
} from "../platform/subscription-plan/store/subscription-plan.selectors.js";

import {
  SUBSCRIPTION_PLAN_TYPES,
  SUBSCRIPTION_PLAN_BILLING_CYCLE,
} from "../platform/subscription-plan/constants/subscription-plan.constants.js";
import Card from "../../components/common/card/Card.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import GridItem from "../../components/common/grid/GridItem.jsx";

// =============================================================================
// Customer Subscription Plans Page
// =============================================================================

function CustomerSubscriptionPlansPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // --------------------------------------------------------------------------
  // Redux State
  // --------------------------------------------------------------------------

  const subscriptionPlans = useSelector(selectAvailableSubscriptionPlans);

  const loading = useSelector(selectAvailableSubscriptionPlanLoading);

  const error = useSelector(selectAvailableSubscriptionPlanError);

  // --------------------------------------------------------------------------
  // Fetch Available Subscription Plans
  // --------------------------------------------------------------------------

  useEffect(() => {
    dispatch(
      getAvailableSubscriptionPlans({
        page: 1,
        limit: 20,
      }),
    );
  }, [dispatch]);

  // --------------------------------------------------------------------------
  // Select Plan
  // --------------------------------------------------------------------------

  const handleSelectPlan = (plan) => {
    if (!plan?._id) {
      showToast({
        type: "error",
        title: "Invalid Subscription Plan",
        message: "Unable to select the subscription plan.",
      });

      return;
    }

    navigate(`/subscription/${plan._id}`);
  };

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  const getPlanTypeVariant = (type) => {
    if (type === SUBSCRIPTION_PLAN_TYPES.PAID) {
      return "success";
    }

    if (type === SUBSCRIPTION_PLAN_TYPES.ENTERPRISE) {
      return "primary";
    }

    if (type === SUBSCRIPTION_PLAN_TYPES.TRIAL) {
      return "warning";
    }

    return "neutral";
  };

  const getBillingLabel = (plan) => {
    const interval = plan?.billingInterval || 1;

    if (plan?.billingCycle === SUBSCRIPTION_PLAN_BILLING_CYCLE.ONE_TIME) {
      return "One Time";
    }

    const cycleLabel =
      plan?.billingCycle === SUBSCRIPTION_PLAN_BILLING_CYCLE.MONTHLY
        ? "Month"
        : plan?.billingCycle === SUBSCRIPTION_PLAN_BILLING_CYCLE.YEARLY
          ? "Year"
          : plan?.billingCycle || "-";

    return `${interval} ${cycleLabel}${interval > 1 ? "s" : ""}`;
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <PageContainer>
      <PageHeader
        title="Choose Your Subscription Plan"
        description="Select a subscription plan to continue with EMBEX360."
      />

      {/* -------------------------------------------------------------------- */}
      {/* Loading                                                              */}
      {/* -------------------------------------------------------------------- */}

      {loading && <div>Loading subscription plans...</div>}

      {/* -------------------------------------------------------------------- */}
      {/* Error                                                                */}
      {/* -------------------------------------------------------------------- */}

      {!loading && error && (
        <Card>
          <div>
            {error?.message || error || "Failed to load subscription plans."}
          </div>
        </Card>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Empty State                                                          */}
      {/* -------------------------------------------------------------------- */}

      {!loading && !error && subscriptionPlans.length === 0 && (
        <Card>
          <div>No subscription plans are currently available.</div>
        </Card>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Subscription Plans                                                   */}
      {/* -------------------------------------------------------------------- */}

      {!loading && subscriptionPlans.length > 0 && (
        <Grid columns={3} gap="medium">
          {subscriptionPlans.map((plan) => (
            <GridItem key={plan._id}>
              <Card>
                {/* ---------------------------------------------------------- */}
                {/* Plan Header                                                */}
                {/* ---------------------------------------------------------- */}

                <div>
                  <h2>{plan.name || "-"}</h2>

                  {plan.type && (
                    <Badge variant={getPlanTypeVariant(plan.type)}>
                      {plan.type}
                    </Badge>
                  )}
                </div>

                {/* ---------------------------------------------------------- */}
                {/* Description                                                 */}
                {/* ---------------------------------------------------------- */}

                {plan.description && <p>{plan.description}</p>}

                {/* ---------------------------------------------------------- */}
                {/* Price                                                       */}
                {/* ---------------------------------------------------------- */}

                <div>
                  <strong>
                    {plan.currency || ""}{" "}
                    {Number(plan.price || 0).toLocaleString()}
                  </strong>

                  <span> / {getBillingLabel(plan)}</span>
                </div>

                {/* ---------------------------------------------------------- */}
                {/* Plan Code                                                   */}
                {/* ---------------------------------------------------------- */}

                {plan.code && <div>Plan Code: {plan.code}</div>}

                {/* ---------------------------------------------------------- */}
                {/* Select Plan                                                 */}
                {/* ---------------------------------------------------------- */}

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Select Plan
                </Button>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}

// =============================================================================
// Export
// =============================================================================

export default CustomerSubscriptionPlansPage;
