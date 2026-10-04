import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  PageContainer,
  PageHeader,
  Button,
  Badge,
  useToast,
} from "../../components/common";
import Card from "../../components/common/card/Card.jsx";

import { getAvailableSubscriptionPlans } from "../platform/subscription-plan/store/subscription-plan.thunks.js";

import {
  selectAvailableSubscriptionPlans,
  selectAvailableSubscriptionPlanLoading,
  selectAvailableSubscriptionPlanError,
} from "../platform/subscription-plan/store/subscription-plan.selectors.js";

import { createSubscription } from "./store/subscription.thunks.js";

import {
  selectCreatedSubscription,
  selectCreateSubscriptionLoading,
  selectCreateSubscriptionError,
} from "./store/subscription.selectors.js";

import { SUBSCRIPTION_PLAN_BILLING_CYCLE } from "../platform/subscription-plan/constants/subscription-plan.constants.js";

function SubscriptionCheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planId } = useParams();
  const { showToast } = useToast();

  const subscriptionPlans = useSelector(selectAvailableSubscriptionPlans);

  const plansLoading = useSelector(selectAvailableSubscriptionPlanLoading);

  const plansError = useSelector(selectAvailableSubscriptionPlanError);

  const createdSubscription = useSelector(selectCreatedSubscription);

  const createLoading = useSelector(selectCreateSubscriptionLoading);

  const createError = useSelector(selectCreateSubscriptionError);

  // ------------------------------------------------------------------------
  // Load Available Plans
  // ------------------------------------------------------------------------

  useEffect(() => {
    if (!planId) {
      return;
    }

    dispatch(
      getAvailableSubscriptionPlans({
        page: 1,
        limit: 100,
      }),
    );
  }, [dispatch, planId]);

  // ------------------------------------------------------------------------
  // Selected Plan
  // ------------------------------------------------------------------------

  const selectedPlan = useMemo(
    () =>
      subscriptionPlans.find((plan) => String(plan?._id) === String(planId)) ||
      null,
    [subscriptionPlans, planId],
  );

  // ------------------------------------------------------------------------
  // Billing Label
  // ------------------------------------------------------------------------

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

  // ------------------------------------------------------------------------
  // Create Subscription
  // ------------------------------------------------------------------------

  const handleCreateSubscription = async () => {
    if (!planId) {
      showToast({
        type: "error",
        title: "Invalid Subscription Plan",
        message: "Subscription plan is required.",
      });
      return;
    }

    if (!selectedPlan) {
      showToast({
        type: "error",
        title: "Subscription Plan Not Found",
        message: "The selected subscription plan is not available.",
      });
      return;
    }

    const result = await dispatch(
      createSubscription({
        subscriptionPlanId: planId,
      }),
    );

    if (createSubscription.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Subscription Selected",
        message:
          "Your subscription has been created and is pending activation.",
      });
    }
  };

  // ------------------------------------------------------------------------
  // Created / Pending Subscription
  // ------------------------------------------------------------------------

  if (createdSubscription) {
    return (
      <PageContainer>
        <PageHeader
          title="Subscription Created"
          description="Your subscription selection has been recorded."
        />

        <Card>
          <div>
            <Badge variant="warning">
              {createdSubscription?.status || "pending"}
            </Badge>

            <h2>{selectedPlan?.name || "Subscription Plan"}</h2>

            <p>Your subscription is currently pending activation.</p>

            <p>
              Payment and subscription activation will be completed in the next
              step.
            </p>

            <Button
              type="button"
              variant="primary"
              onClick={() => navigate("/")}
            >
              Continue
            </Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  // ------------------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------------------

  if (plansLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Subscription"
          description="Loading selected subscription plan..."
        />

        <Card>
          <div>Loading subscription plan...</div>
        </Card>
      </PageContainer>
    );
  }

  // ------------------------------------------------------------------------
  // Plan Error
  // ------------------------------------------------------------------------

  if (plansError) {
    return (
      <PageContainer>
        <PageHeader
          title="Subscription"
          description="Unable to load the selected subscription plan."
        />

        <Card>
          <div>
            {plansError?.message ||
              plansError ||
              "Failed to load subscription plan."}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/subscription")}
          >
            Back to Plans
          </Button>
        </Card>
      </PageContainer>
    );
  }

  // ------------------------------------------------------------------------
  // Invalid Plan
  // ------------------------------------------------------------------------

  if (!selectedPlan) {
    return (
      <PageContainer>
        <PageHeader
          title="Subscription"
          description="The selected subscription plan is unavailable."
        />

        <Card>
          <div>
            The selected subscription plan could not be found or is no longer
            available.
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/subscription")}
          >
            Back to Plans
          </Button>
        </Card>
      </PageContainer>
    );
  }

  // ------------------------------------------------------------------------
  // Render Checkout
  // ------------------------------------------------------------------------

  return (
    <PageContainer>
      <PageHeader
        title="Confirm Subscription"
        description="Review your selected subscription plan before continuing."
      />

      <Card>
        <div>
          <h2>{selectedPlan.name || "-"}</h2>

          {selectedPlan.type && (
            <Badge variant="primary">{selectedPlan.type}</Badge>
          )}

          {selectedPlan.description && <p>{selectedPlan.description}</p>}

          <div>
            <strong>
              {selectedPlan.currency || ""}{" "}
              {Number(selectedPlan.price || 0).toLocaleString()}
            </strong>

            <span>
              {" / "}
              {getBillingLabel(selectedPlan)}
            </span>
          </div>

          {selectedPlan.code && <div>Plan Code: {selectedPlan.code}</div>}
        </div>

        {createError && (
          <div>
            {createError?.message ||
              createError ||
              "Failed to create subscription."}
          </div>
        )}

        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/subscription")}
            disabled={createLoading}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleCreateSubscription}
            disabled={createLoading}
          >
            {createLoading
              ? "Creating Subscription..."
              : "Confirm Subscription"}
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}

export default SubscriptionCheckoutPage;
