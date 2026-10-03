// =============================================================================
// Subscription Plan Page
// =============================================================================

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  PageContainer,
  PageHeader,
  Table,
  Modal,
  FormField,
  Input,
  Select,
  Button,
  Badge,
  useToast,
} from "../../../components/common";

import {
  createSubscriptionPlan,
  getSubscriptionPlans,
} from "./store/subscription-plan.thunks.js";

import {
  selectSubscriptionPlans,
  selectSubscriptionPlanPagination,
  selectSubscriptionPlanListLoading,
  selectSubscriptionPlanListError,
  selectCreateSubscriptionPlanLoading,
} from "./store/subscription-plan.selectors.js";

import {
  SUBSCRIPTION_PLAN_STATUS,
  SUBSCRIPTION_PLAN_TYPES,
  SUBSCRIPTION_PLAN_BILLING_CYCLE,
  SUBSCRIPTION_PLAN_CURRENCIES,
} from "./constants/subscription-plan.constants.js";

import { validateCreateSubscriptionPlan } from "./validations/subscription-plan.validation.js";

import SUBSCRIPTION_PLAN_MESSAGES from "./constants/subscription-plan.messages.js";

// =============================================================================
// Initial Form
// =============================================================================

const INITIAL_FORM = {
  name: "",
  code: "",
  type: SUBSCRIPTION_PLAN_TYPES.PAID,
  description: "",
  price: "",
  currency: SUBSCRIPTION_PLAN_CURRENCIES.INR,
  billingCycle: SUBSCRIPTION_PLAN_BILLING_CYCLE.MONTHLY,
  billingInterval: "1",
};

// =============================================================================
// Subscription Plan Page
// =============================================================================

function SubscriptionPlanPage() {
  const dispatch = useDispatch();

  // ---------------------------------------------------------------------------
  // Redux State
  // ---------------------------------------------------------------------------

  const subscriptionPlans = useSelector(selectSubscriptionPlans);

  const pagination = useSelector(selectSubscriptionPlanPagination);

  const loading = useSelector(selectSubscriptionPlanListLoading);

  const error = useSelector(selectSubscriptionPlanListError);

  const submitting = useSelector(selectCreateSubscriptionPlanLoading);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

  const [formErrors, setFormErrors] = useState({});

  const [search, setSearch] = useState("");

  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Initial Subscription Plan Fetch
  // ---------------------------------------------------------------------------

  useEffect(() => {
    dispatch(
      getSubscriptionPlans({
        page: 1,
        limit: pagination?.limit || 20,
      }),
    );
  }, [dispatch]);

  // =============================================================================
  // Select Options
  // =============================================================================

  const planTypeOptions = useMemo(
    () => [
      {
        value: SUBSCRIPTION_PLAN_TYPES.FREE,
        label: "Free",
      },
      {
        value: SUBSCRIPTION_PLAN_TYPES.TRIAL,
        label: "Trial",
      },
      {
        value: SUBSCRIPTION_PLAN_TYPES.PAID,
        label: "Paid",
      },
      {
        value: SUBSCRIPTION_PLAN_TYPES.ENTERPRISE,
        label: "Enterprise",
      },
    ],
    [],
  );

  const billingCycleOptions = useMemo(
    () => [
      {
        value: SUBSCRIPTION_PLAN_BILLING_CYCLE.MONTHLY,
        label: "Monthly",
      },
      {
        value: SUBSCRIPTION_PLAN_BILLING_CYCLE.YEARLY,
        label: "Yearly",
      },
      {
        value: SUBSCRIPTION_PLAN_BILLING_CYCLE.ONE_TIME,
        label: "One Time",
      },
    ],
    [],
  );

  const currencyOptions = useMemo(
    () => [
      {
        value: SUBSCRIPTION_PLAN_CURRENCIES.INR,
        label: "INR",
      },
      {
        value: SUBSCRIPTION_PLAN_CURRENCIES.USD,
        label: "USD",
      },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      {
        value: SUBSCRIPTION_PLAN_STATUS.ACTIVE,
        label: "Active",
      },
      {
        value: SUBSCRIPTION_PLAN_STATUS.INACTIVE,
        label: "Inactive",
      },
    ],
    [],
  );

  // =============================================================================
  // Form Handlers
  // =============================================================================

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  // ---------------------------------------------------------------------------
  // Open Create Modal
  // ---------------------------------------------------------------------------

  const handleOpenCreateModal = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Close Create Modal
  // ---------------------------------------------------------------------------

  const handleCloseCreateModal = () => {
    if (submitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setForm(INITIAL_FORM);
    setFormErrors({});
  };

  // =============================================================================
  // Submit
  // =============================================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const values = {
      name: form.name.trim(),
      code: form.code.trim(),
      type: form.type,
      description: form.description.trim(),
      price:
        form.price === "" || form.price === null
          ? form.price
          : Number(form.price),
      currency: form.currency,
      billingCycle: form.billingCycle,
      billingInterval:
        form.billingInterval === "" || form.billingInterval === null
          ? form.billingInterval
          : Number(form.billingInterval),
    };

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    const validationErrors = validateCreateSubscriptionPlan(values);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});

    // -------------------------------------------------------------------------
    // Create Subscription Plan
    // -------------------------------------------------------------------------

    const result = await dispatch(createSubscriptionPlan(values));

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    if (createSubscriptionPlan.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Subscription Plan Created",
        message:
          SUBSCRIPTION_PLAN_MESSAGES.CREATED ||
          "Subscription plan created successfully.",
      });

      setIsCreateModalOpen(false);
      setForm(INITIAL_FORM);
      setFormErrors({});

      dispatch(
        getSubscriptionPlans({
          page: pagination?.page || 1,
          limit: pagination?.limit || 20,
          search,
        }),
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Backend Validation Errors
    // -------------------------------------------------------------------------

    if (result.payload?.errors) {
      setFormErrors(result.payload.errors);
    }

    // -------------------------------------------------------------------------
    // Error Toast
    // -------------------------------------------------------------------------

    showToast({
      type: "error",
      title: "Create Subscription Plan Failed",
      message:
        result.payload?.message ||
        SUBSCRIPTION_PLAN_MESSAGES.CREATE_FAILED ||
        "Failed to create subscription plan.",
    });
  };

  // =============================================================================
  // Pagination / Search
  // =============================================================================

  const handlePageChange = (page) => {
    dispatch(
      getSubscriptionPlans({
        page,
        limit: pagination?.limit || 20,
        search,
      }),
    );
  };

  const handleLimitChange = (limit) => {
    dispatch(
      getSubscriptionPlans({
        page: 1,
        limit,
        search,
      }),
    );
  };

  const handleSearchChange = (value) => {
    setSearch(value);

    dispatch(
      getSubscriptionPlans({
        page: 1,
        limit: pagination?.limit || 20,
        search: value,
      }),
    );
  };

  // =============================================================================
  // Badge Helpers
  // =============================================================================

  const getStatusVariant = (status) => {
    if (status === SUBSCRIPTION_PLAN_STATUS.ACTIVE) {
      return "success";
    }

    return "neutral";
  };

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

  // =============================================================================
  // Table Columns
  // =============================================================================

  const columns = [
    {
      key: "name",
      label: "Plan Name",
      render: (plan) => plan.name || "-",
    },

    {
      key: "code",
      label: "Code",
      render: (plan) => plan.code || "-",
    },

    {
      key: "type",
      label: "Type",
      render: (plan) => (
        <Badge variant={getPlanTypeVariant(plan.type)}>
          {plan.type || "-"}
        </Badge>
      ),
    },

    {
      key: "price",
      label: "Price",
      render: (plan) => {
        if (plan.price === undefined || plan.price === null) {
          return "-";
        }

        return `${plan.currency || ""} ${Number(plan.price).toLocaleString()}`;
      },
    },

    {
      key: "billingCycle",
      label: "Billing",
      render: (plan) => {
        const interval = plan.billingInterval || 1;

        if (plan.billingCycle === SUBSCRIPTION_PLAN_BILLING_CYCLE.ONE_TIME) {
          return "One Time";
        }

        const cycleLabel =
          plan.billingCycle === SUBSCRIPTION_PLAN_BILLING_CYCLE.MONTHLY
            ? "Month"
            : plan.billingCycle === SUBSCRIPTION_PLAN_BILLING_CYCLE.YEARLY
              ? "Year"
              : plan.billingCycle || "-";

        return `${interval} ${cycleLabel}${interval > 1 ? "s" : ""}`;
      },
    },

    {
      key: "status",
      label: "Status",
      render: (plan) => (
        <Badge variant={getStatusVariant(plan.status)}>
          {plan.status || "-"}
        </Badge>
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
        title="Subscription Plans"
        description="Manage subscription plans and their pricing configuration."
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            Create Subscription Plan
          </Button>
        }
      />

      {/* -----------------------------------------------------------------------
          Subscription Plan Table
      ----------------------------------------------------------------------- */}

      <Table
        title="Subscription Plan List"
        columns={columns}
        data={subscriptionPlans}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search subscription plans..."
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        emptyMessage={
          error ||
          SUBSCRIPTION_PLAN_MESSAGES.LIST_FETCHED ||
          "No subscription plans found."
        }
      />

      {/* -----------------------------------------------------------------------
          Create Subscription Plan Modal
      ----------------------------------------------------------------------- */}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create Subscription Plan"
        size="medium"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseCreateModal}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="create-subscription-plan-form"
              variant="primary"
              loading={submitting}
              loadingText="Creating..."
            >
              Create Subscription Plan
            </Button>
          </>
        }
      >
        <form id="create-subscription-plan-form" onSubmit={handleSubmit}>
          {/* -------------------------------------------------------------------
              Name
          ------------------------------------------------------------------- */}

          <FormField
            label="Plan Name"
            name="name"
            required
            error={formErrors.name}
          >
            <Input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Enter plan name"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Code
          ------------------------------------------------------------------- */}

          <FormField
            label="Plan Code"
            name="code"
            required
            error={formErrors.code}
          >
            <Input
              name="code"
              value={form.code}
              onChange={handleFormChange}
              placeholder="Enter plan code"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Type
          ------------------------------------------------------------------- */}

          <FormField
            label="Plan Type"
            name="type"
            required
            error={formErrors.type}
          >
            <Select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              options={planTypeOptions}
              placeholder="Select plan type"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Description
          ------------------------------------------------------------------- */}

          <FormField
            label="Description"
            name="description"
            error={formErrors.description}
          >
            <Input
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Enter plan description"
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Price
          ------------------------------------------------------------------- */}

          <FormField
            label="Price"
            name="price"
            required
            error={formErrors.price}
          >
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleFormChange}
              placeholder="Enter plan price"
              min="0"
              step="0.01"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Currency
          ------------------------------------------------------------------- */}

          <FormField
            label="Currency"
            name="currency"
            required
            error={formErrors.currency}
          >
            <Select
              name="currency"
              value={form.currency}
              onChange={handleFormChange}
              options={currencyOptions}
              placeholder="Select currency"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Billing Cycle
          ------------------------------------------------------------------- */}

          <FormField
            label="Billing Cycle"
            name="billingCycle"
            required
            error={formErrors.billingCycle}
          >
            <Select
              name="billingCycle"
              value={form.billingCycle}
              onChange={handleFormChange}
              options={billingCycleOptions}
              placeholder="Select billing cycle"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Billing Interval
          ------------------------------------------------------------------- */}

          <FormField
            label="Billing Interval"
            name="billingInterval"
            required
            error={formErrors.billingInterval}
          >
            <Input
              type="number"
              name="billingInterval"
              value={form.billingInterval}
              onChange={handleFormChange}
              placeholder="Enter billing interval"
              min="1"
              step="1"
              required
              disabled={
                submitting ||
                form.billingCycle === SUBSCRIPTION_PLAN_BILLING_CYCLE.ONE_TIME
              }
            />
          </FormField>
        </form>
      </Modal>
    </PageContainer>
  );
}

// =============================================================================
// Export
// =============================================================================

export default SubscriptionPlanPage;
