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

// =============================================================================
// Razorpay Script Loader
// =============================================================================

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));

      existingScript.addEventListener("error", () =>
        reject(new Error("Unable to load Razorpay checkout.")),
      );

      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () =>
      reject(new Error("Unable to load Razorpay checkout."));

    document.body.appendChild(script);
  });

// =============================================================================
// Page
// =============================================================================

function SubscriptionCheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { planId } = useParams();
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Subscription Plan State
  // ---------------------------------------------------------------------------

  const subscriptionPlans = useSelector(selectAvailableSubscriptionPlans);

  const plansLoading = useSelector(selectAvailableSubscriptionPlanLoading);

  const plansError = useSelector(selectAvailableSubscriptionPlanError);

  // ---------------------------------------------------------------------------
  // Subscription State
  // ---------------------------------------------------------------------------

  const createSubscriptionLoading = useSelector(
    selectCreateSubscriptionLoading,
  );

  const createSubscriptionError = useSelector(selectCreateSubscriptionError);

  // ---------------------------------------------------------------------------
  // Payment State
  // ---------------------------------------------------------------------------

  const paymentOrder = useSelector(selectPaymentOrder);

  const createOrderLoading = useSelector(selectCreateOrderLoading);

  const createOrderError = useSelector(selectCreateOrderError);

  const verifyPaymentLoading = useSelector(selectVerifyPaymentLoading);

  const verifyPaymentError = useSelector(selectVerifyPaymentError);

  const paymentVerified = useSelector(selectPaymentVerified);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [paymentSubscriptionId, setPaymentSubscriptionId] = useState(null);

  // ---------------------------------------------------------------------------
  // Load Available Plans
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Selected Plan
  // ---------------------------------------------------------------------------

  const selectedPlan = useMemo(
    () =>
      subscriptionPlans.find((plan) => String(plan?._id) === String(planId)) ||
      null,
    [subscriptionPlans, planId],
  );

  // ---------------------------------------------------------------------------
  // Billing Label
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Open Razorpay Checkout
  // ---------------------------------------------------------------------------

  const openRazorpayCheckout = async ({ subscriptionId, order }) => {
    if (!subscriptionId || !order?.id) {
      showToast({
        type: "error",
        title: "Payment Error",
        message: "Unable to initialize the payment.",
      });

      return;
    }

    try {
      setPaymentProcessing(true);

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is unavailable.");
      }

      const options = {
        key: order.keyId,

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "EMBEX360",

        description: selectedPlan?.name || "EMBEX360 Subscription",

        handler: async (response) => {
          const verifyResult = await dispatch(
            verifyPayment({
              subscriptionId,

              providerOrderId: response?.razorpay_order_id,

              providerPaymentId: response?.razorpay_payment_id,

              signature: response?.razorpay_signature,
            }),
          );

          if (verifyPayment.fulfilled.match(verifyResult)) {
            showToast({
              type: "success",
              title: "Payment Successful",
              message: "Your subscription has been activated successfully.",
            });
          } else {
            showToast({
              type: "error",
              title: "Payment Verification Failed",
              message:
                verifyResult?.payload?.message ||
                "Payment verification failed.",
            });
          }

          setPaymentProcessing(false);
        },

        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);

            showToast({
              type: "warning",
              title: "Payment Cancelled",
              message:
                "The payment window was closed. Your subscription remains pending.",
            });
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setPaymentProcessing(false);

        showToast({
          type: "error",
          title: "Payment Failed",
          message:
            response?.error?.description || "Payment could not be completed.",
        });
      });

      razorpay.open();
    } catch (error) {
      setPaymentProcessing(false);

      showToast({
        type: "error",
        title: "Payment Error",
        message: error?.message || "Unable to open payment checkout.",
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Create Subscription + Payment Order
  // ---------------------------------------------------------------------------

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

      const subscriptionId = subscription?._id || subscription?.subscriptionId;

      if (!subscriptionId) {
        setPaymentProcessing(false);

        showToast({
          type: "error",
          title: "Subscription Error",
          message:
            "Subscription was created but its reference could not be obtained.",
        });

        return;
      }

      setPaymentSubscriptionId(subscriptionId);

      // -----------------------------------------------------------------------
      // Step 2 - Create Razorpay Order
      // -----------------------------------------------------------------------

      const paymentOrderResult = await dispatch(
        createPaymentOrder({
          subscriptionId,
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
            "Failed to create payment order.",
        });

        return;
      }

      const paymentData =
        paymentOrderResult?.payload?.data || paymentOrderResult?.payload;

      const order = paymentData?.order;

      if (!order?.id) {
        setPaymentProcessing(false);

        showToast({
          type: "error",
          title: "Payment Error",
          message: "Payment order could not be initialized.",
        });

        return;
      }

      // -----------------------------------------------------------------------
      // Step 3 - Open Razorpay Checkout
      // -----------------------------------------------------------------------

      await openRazorpayCheckout({
        subscriptionId,
        order,
      });
    } catch (error) {
      setPaymentProcessing(false);

      showToast({
        type: "error",
        title: "Subscription Payment Error",
        message:
          error?.message || "Unable to continue with subscription payment.",
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Payment Success
  // ---------------------------------------------------------------------------

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

            <p>You can now continue with your EMBEX360 account setup.</p>

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

  // ---------------------------------------------------------------------------
  // Loading Plan
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Plan Error
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Invalid Plan
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Checkout
  // ---------------------------------------------------------------------------

  const isProcessing =
    createSubscriptionLoading ||
    createOrderLoading ||
    verifyPaymentLoading ||
    paymentProcessing;

  const paymentError =
    createSubscriptionError || createOrderError || verifyPaymentError;

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

        {paymentError && (
          <div>
            {paymentError?.message ||
              paymentError ||
              "Unable to continue with payment."}
          </div>
        )}

        {paymentOrder && (
          <div>
            <Badge variant="warning">Payment Ready</Badge>

            <p>Your secure payment checkout is ready.</p>
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

          <Button
            type="button"
            variant="primary"
            onClick={handleCreateSubscription}
            disabled={isProcessing}
          >
            {verifyPaymentLoading
              ? "Verifying Payment..."
              : paymentProcessing
                ? "Opening Payment..."
                : createOrderLoading
                  ? "Preparing Payment..."
                  : createSubscriptionLoading
                    ? "Creating Subscription..."
                    : "Proceed to Payment"}
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}

export default SubscriptionCheckoutPage;
