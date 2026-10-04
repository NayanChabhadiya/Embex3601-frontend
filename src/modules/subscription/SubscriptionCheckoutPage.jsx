import { useEffect, useMemo, useState } from "react";
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
  selectCreateSubscriptionLoading,
  selectCreateSubscriptionError,
} from "./store/subscription.selectors.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "./store/subscription-payment.thunks.js";

import {
  selectPaymentOrder,
  selectCreateOrderLoading,
  selectCreateOrderError,
  selectVerifyPaymentLoading,
  selectVerifyPaymentError,
  selectPaymentVerified,
} from "./store/subscription-payment.selectors.js";

import { SUBSCRIPTION_PLAN_BILLING_CYCLE } from "../platform/subscription-plan/constants/subscription-plan.constants.js";

function SubscriptionCheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planId } = useParams();
  const { showToast } = useToast();

  // ===========================================================================
  // Subscription Plan State
  // ===========================================================================

  const subscriptionPlans = useSelector(selectAvailableSubscriptionPlans);

  const plansLoading = useSelector(selectAvailableSubscriptionPlanLoading);

  const plansError = useSelector(selectAvailableSubscriptionPlanError);

  // ===========================================================================
  // Subscription State
  // ===========================================================================

  const createSubscriptionLoading = useSelector(
    selectCreateSubscriptionLoading,
  );

  const createSubscriptionError = useSelector(selectCreateSubscriptionError);

  // ===========================================================================
  // Payment State
  // ===========================================================================

  const paymentOrder = useSelector(selectPaymentOrder);

  const createOrderLoading = useSelector(selectCreateOrderLoading);

  const createOrderError = useSelector(selectCreateOrderError);

  const verifyPaymentLoading = useSelector(selectVerifyPaymentLoading);

  const verifyPaymentError = useSelector(selectVerifyPaymentError);

  const paymentVerified = useSelector(selectPaymentVerified);

  // ===========================================================================
  // Local State
  // ===========================================================================

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [subscriptionId, setSubscriptionId] = useState(null);

  const [paymentReference, setPaymentReference] = useState("");

  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // ===========================================================================
  // Load Available Plans
  // ===========================================================================

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

  // ===========================================================================
  // Selected Plan
  // ===========================================================================

  const selectedPlan = useMemo(
    () =>
      subscriptionPlans.find((plan) => String(plan?._id) === String(planId)) ||
      null,
    [subscriptionPlans, planId],
  );

  // ===========================================================================
  // Billing Label
  // ===========================================================================

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

  // ===========================================================================
  // Create Subscription + Manual Payment Order
  // ===========================================================================

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

    try {
      setPaymentProcessing(true);

      // -----------------------------------------------------------------------
      // Step 1 - Create Pending Subscription
      // -----------------------------------------------------------------------

      const subscriptionResult = await dispatch(
        createSubscription({
          subscriptionPlanId: planId,
        }),
      );

      if (!createSubscription.fulfilled.match(subscriptionResult)) {
        setPaymentProcessing(false);

        showToast({
          type: "error",
          title: "Subscription Failed",
          message:
            subscriptionResult?.payload?.message ||
            subscriptionResult?.payload ||
            "Failed to create subscription.",
        });

        return;
      }

      const subscription =
        subscriptionResult?.payload?.data || subscriptionResult?.payload;

      const createdSubscriptionId =
        subscription?._id || subscription?.subscriptionId;

      if (!createdSubscriptionId) {
        setPaymentProcessing(false);

        showToast({
          type: "error",
          title: "Subscription Error",
          message:
            "Subscription was created but its reference could not be obtained.",
        });

        return;
      }

      setSubscriptionId(createdSubscriptionId);

      // -----------------------------------------------------------------------
      // Step 2 - Create Manual Payment Record
      // -----------------------------------------------------------------------

      const paymentOrderResult = await dispatch(
        createPaymentOrder({
          subscriptionId: createdSubscriptionId,
        }),
      );

      if (!createPaymentOrder.fulfilled.match(paymentOrderResult)) {
        setPaymentProcessing(false);

        showToast({
          type: "error",
          title: "Payment Initialization Failed",
          message:
            paymentOrderResult?.payload?.message ||
            paymentOrderResult?.payload ||
            "Failed to create payment record.",
        });

        return;
      }

      setPaymentProcessing(false);

      showToast({
        type: "success",
        title: "Subscription Created",
        message: "Your subscription is pending payment verification.",
      });
    } catch (error) {
      setPaymentProcessing(false);

      showToast({
        type: "error",
        title: "Subscription Error",
        message: error?.message || "Unable to continue with subscription.",
      });
    }
  };

  // ===========================================================================
  // Submit Manual Payment Reference
  // ===========================================================================

  const handleSubmitPaymentReference = async () => {
    const trimmedReference = paymentReference.trim();

    if (!subscriptionId) {
      showToast({
        type: "error",
        title: "Subscription Not Found",
        message: "Please initialize the subscription payment first.",
      });

      return;
    }

    if (!trimmedReference) {
      showToast({
        type: "error",
        title: "Payment Reference Required",
        message: "Please enter your payment reference or UTR number.",
      });

      return;
    }

    try {
      setPaymentProcessing(true);

      /*
       * IMPORTANT:
       * Backend validation currently still expects a signature field.
       * We intentionally do not send a fake signature here.
       *
       * The validation file will be updated next so manual payment
       * submission can be handled correctly.
       */

      const result = await dispatch(
        verifyPayment({
          subscriptionId,
          providerOrderId: paymentOrder?.id,
          providerPaymentId: trimmedReference,
        }),
      );

      if (verifyPayment.fulfilled.match(result)) {
        setPaymentSubmitted(true);

        showToast({
          type: "success",
          title: "Payment Submitted",
          message:
            "Your payment reference has been submitted and is awaiting verification.",
        });
      } else {
        showToast({
          type: "error",
          title: "Payment Submission Failed",
          message:
            result?.payload?.message ||
            result?.payload ||
            "Unable to submit payment reference.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Payment Submission Failed",
        message: error?.message || "Unable to submit payment reference.",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  // ===========================================================================
  // Subscription Activated
  // ===========================================================================

  if (paymentVerified) {
    return (
      <PageContainer>
        <PageHeader
          title="Subscription Activated"
          description="Your EMBEX360 subscription is now active."
        />

        <Card>
          <div>
            <Badge variant="success">Active</Badge>

            <h2>{selectedPlan?.name || "Subscription Plan"}</h2>

            <p>
              Your payment was successfully verified and your subscription is
              now active.
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

  // ===========================================================================
  // Loading Plan
  // ===========================================================================

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

  // ===========================================================================
  // Plan Error
  // ===========================================================================

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

  // ===========================================================================
  // Invalid Plan
  // ===========================================================================

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

  // ===========================================================================
  // Payment State
  // ===========================================================================

  const isProcessing =
    createSubscriptionLoading ||
    createOrderLoading ||
    verifyPaymentLoading ||
    paymentProcessing;

  const paymentError =
    createSubscriptionError || createOrderError || verifyPaymentError;

  // ===========================================================================
  // Manual Payment Submitted
  // ===========================================================================

  if (paymentSubmitted) {
    return (
      <PageContainer>
        <PageHeader
          title="Payment Submitted"
          description="Your payment is awaiting verification."
        />

        <Card>
          <div>
            <Badge variant="warning">Awaiting Verification</Badge>

            <h2>{selectedPlan.name}</h2>

            <p>Your payment reference has been submitted successfully.</p>

            <p>
              EMBEX360 will verify the payment before activating your
              subscription.
            </p>

            {paymentReference && (
              <div>
                <strong>Payment Reference:</strong> {paymentReference}
              </div>
            )}

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

  // ===========================================================================
  // Checkout
  // ===========================================================================

  return (
    <PageContainer>
      <PageHeader
        title="Confirm Subscription"
        description="Review your selected subscription plan and complete the manual payment."
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

        {paymentError && (
          <div>
            {paymentError?.message ||
              paymentError ||
              "Unable to continue with payment."}
          </div>
        )}

        {!paymentOrder && (
          <div>
            <h3>Manual Payment</h3>

            <p>Click the button below to generate your payment reference.</p>

            <p>
              After completing the payment manually, you will submit your UTR or
              transaction reference for verification.
            </p>
          </div>
        )}

        {paymentOrder && (
          <div>
            <Badge variant="warning">Payment Pending</Badge>

            <h3>Manual Payment Instructions</h3>

            <p>
              Please complete the payment manually using the payment method
              provided by EMBEX360.
            </p>

            <div>
              <strong>Payment Amount:</strong>{" "}
              {paymentOrder.currency || selectedPlan.currency}{" "}
              {(Number(paymentOrder.amount || 0) / 100).toLocaleString()}
            </div>

            <div>
              <strong>Payment Reference:</strong> {paymentOrder.id || "-"}
            </div>

            <div>
              <strong>Status:</strong> Awaiting Payment
            </div>

            <div>
              <label htmlFor="paymentReference">
                Payment UTR / Transaction Reference
              </label>

              <input
                id="paymentReference"
                type="text"
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
                placeholder="Enter UTR / transaction reference"
                disabled={isProcessing}
              />
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={handleSubmitPaymentReference}
              disabled={isProcessing}
            >
              {verifyPaymentLoading
                ? "Submitting..."
                : "Submit Payment Reference"}
            </Button>
          </div>
        )}

        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/subscription")}
            disabled={isProcessing}
          >
            Back
          </Button>

          {!paymentOrder && (
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateSubscription}
              disabled={isProcessing}
            >
              {createOrderLoading
                ? "Preparing Payment..."
                : createSubscriptionLoading
                  ? "Creating Subscription..."
                  : paymentProcessing
                    ? "Processing..."
                    : "Proceed to Manual Payment"}
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}

export default SubscriptionCheckoutPage;
