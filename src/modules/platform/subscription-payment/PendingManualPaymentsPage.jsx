// =============================================================================
// Pending Manual Payments Page
// =============================================================================

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  PageContainer,
  PageHeader,
  Table,
  Modal,
  Button,
  Badge,
  useToast,
} from "../../../components/common";

import {
  getPendingManualPayments,
  verifyManualPayment,
} from "../../subscription/store/subscription-payment.thunks.js";

import {
  selectPendingPayments,
  selectPendingPaymentsMeta,
  selectPendingPaymentsLoading,
  selectPendingPaymentsError,
} from "../../subscription/store/subscription-payment.selectors.js";

// =============================================================================
// Pending Manual Payments Page
// =============================================================================

function PendingManualPaymentsPage() {
  const dispatch = useDispatch();

  // ---------------------------------------------------------------------------
  // Redux State
  // ---------------------------------------------------------------------------

  const pendingPayments = useSelector(selectPendingPayments);

  const pagination = useSelector(selectPendingPaymentsMeta);

  const loading = useSelector(selectPendingPaymentsLoading);

  const error = useSelector(selectPendingPaymentsError);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const { showToast } = useToast();

  // =============================================================================
  // Initial Pending Payment Fetch
  // =============================================================================

  useEffect(() => {
    dispatch(
      getPendingManualPayments({
        page: 1,
        limit: pagination?.limit || 20,
      }),
    );
  }, [dispatch]);

  // =============================================================================
  // Open Verify Modal
  // =============================================================================

  const handleOpenVerifyModal = (payment) => {
    setSelectedPayment(payment);
    setIsVerifyModalOpen(true);
  };

  // =============================================================================
  // Close Verify Modal
  // =============================================================================

  const handleCloseVerifyModal = () => {
    setSelectedPayment(null);
    setIsVerifyModalOpen(false);
  };

  // =============================================================================
  // Verify Manual Payment
  // =============================================================================

  const handleVerifyPayment = async () => {
    if (!selectedPayment?.paymentId) {
      return;
    }

    const result = await dispatch(
      verifyManualPayment(selectedPayment.paymentId),
    );

    if (verifyManualPayment.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Payment Verified",
        message:
          result.payload?.message || "Manual payment verified successfully.",
      });

      setSelectedPayment(null);
      setIsVerifyModalOpen(false);

      return;
    }

    showToast({
      type: "error",
      title: "Payment Verification Failed",
      message: result.payload?.message || "Failed to verify manual payment.",
    });
  };

  // =============================================================================
  // Pagination
  // =============================================================================

  const handlePageChange = (page) => {
    dispatch(
      getPendingManualPayments({
        page,
        limit: pagination?.limit || 20,
      }),
    );
  };

  // ---------------------------------------------------------------------------
  // Limit Change
  // ---------------------------------------------------------------------------

  const handleLimitChange = (limit) => {
    dispatch(
      getPendingManualPayments({
        page: 1,
        limit,
      }),
    );
  };

  // =============================================================================
  // Badge Helpers
  // =============================================================================

  const getPaymentStatusVariant = (status) => {
    if (status === "captured") {
      return "success";
    }

    if (status === "failed") {
      return "danger";
    }

    if (status === "authorized") {
      return "warning";
    }

    return "neutral";
  };

  const getOrderStatusVariant = (status) => {
    if (status === "paid") {
      return "success";
    }

    if (status === "failed") {
      return "danger";
    }

    if (status === "cancelled") {
      return "warning";
    }

    return "neutral";
  };

  // =============================================================================
  // Format Helpers
  // =============================================================================

  const formatAmount = (amount, currency) => {
    if (amount === undefined || amount === null) {
      return "-";
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      return "-";
    }

    // Backend stores payment amount in minor units.
    const majorAmount = numericAmount / 100;

    return `${currency || ""} ${majorAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("en-IN");
  };

  // =============================================================================
  // Table Columns
  // =============================================================================

  const columns = [
    {
      key: "paymentId",
      label: "Payment ID",
      render: (payment) => payment.paymentId || "-",
    },

    {
      key: "providerPaymentId",
      label: "UTR / Reference",
      render: (payment) => payment.providerPaymentId || "-",
    },

    {
      key: "userId",
      label: "Customer",
      render: (payment) => {
        if (payment.userId && typeof payment.userId === "object") {
          return (
            payment.userId.name ||
            payment.userId.email ||
            payment.userId.userId ||
            "-"
          );
        }

        return payment.userId || "-";
      },
    },

    {
      key: "amount",
      label: "Amount",
      render: (payment) => formatAmount(payment.amount, payment.currency),
    },

    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (payment) => (
        <Badge variant={getPaymentStatusVariant(payment.paymentStatus)}>
          {payment.paymentStatus || "-"}
        </Badge>
      ),
    },

    {
      key: "orderStatus",
      label: "Order Status",
      render: (payment) => (
        <Badge variant={getOrderStatusVariant(payment.orderStatus)}>
          {payment.orderStatus || "-"}
        </Badge>
      ),
    },

    {
      key: "createdAt",
      label: "Submitted At",
      render: (payment) => formatDate(payment.createdAt),
    },

    {
      key: "actions",
      label: "Action",
      render: (payment) => (
        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={() => handleOpenVerifyModal(payment)}
        >
          Verify
        </Button>
      ),
    },
  ];

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <PageContainer>
      {/* -----------------------------------------------------------------------
          Page Header
      ----------------------------------------------------------------------- */}

      <PageHeader
        title="Pending Manual Payments"
        description="Review and verify customer manual payment submissions."
      />

      {/* -----------------------------------------------------------------------
          Pending Payments Table
      ----------------------------------------------------------------------- */}

      <Table
        title="Pending Payment List"
        columns={columns}
        data={pendingPayments}
        rowKey="paymentId"
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        emptyMessage={error?.message || "No pending manual payments found."}
      />

      {/* -----------------------------------------------------------------------
          Verify Payment Modal
      ----------------------------------------------------------------------- */}

      <Modal
        isOpen={isVerifyModalOpen}
        onClose={handleCloseVerifyModal}
        title="Verify Manual Payment"
        size="medium"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseVerifyModal}
              disabled={false}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleVerifyPayment}
              loading={false}
              loadingText="Verifying..."
            >
              Verify Payment
            </Button>
          </>
        }
      >
        {selectedPayment && (
          <div>
            <p>
              <strong>Payment ID:</strong> {selectedPayment.paymentId || "-"}
            </p>

            <p>
              <strong>UTR / Reference:</strong>{" "}
              {selectedPayment.providerPaymentId || "-"}
            </p>

            <p>
              <strong>Amount:</strong>{" "}
              {formatAmount(selectedPayment.amount, selectedPayment.currency)}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              {selectedPayment.paymentStatus || "-"}
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              {selectedPayment.orderStatus || "-"}
            </p>

            <p>
              <strong>Submitted At:</strong>{" "}
              {formatDate(selectedPayment.createdAt)}
            </p>

            <p>Are you sure you want to verify this payment?</p>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}

// =============================================================================
// Export
// =============================================================================

export default PendingManualPaymentsPage;
