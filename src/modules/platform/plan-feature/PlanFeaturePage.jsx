// =============================================================================
// Plan Feature Page
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
  Button,
  Badge,
  useToast,
  Select,
} from "../../../components/common";

import {
  createPlanFeature,
  getPlanFeatures,
} from "./store/plan-feature.thunks.js";

import { getSubscriptionPlans } from "../subscription-plan/store/subscription-plan.thunks.js";
import { getFeatures } from "../feature/store/feature.thunks.js";

import {
  selectPlanFeatures,
  selectPlanFeaturePagination,
  selectPlanFeatureListLoading,
  selectPlanFeatureListError,
  selectCreatePlanFeatureLoading,
} from "./store/plan-feature.selectors.js";

import { selectSubscriptionPlans } from "../subscription-plan/store/subscription-plan.selectors.js";
import { selectFeatures } from "../feature/store/feature.selectors.js";

import { validateCreatePlanFeature } from "./validations/plan-feature.validation.js";

import { PLAN_FEATURE_STATUS } from "./constants/plan-feature.constants.js";

import PLAN_FEATURE_MESSAGES from "./constants/plan-feature.messages.js";

// =============================================================================
// Initial Form
// =============================================================================

const INITIAL_FORM = {
  planId: "",
  featureId: "",
  value: "",
};

// =============================================================================
// Plan Feature Page
// =============================================================================

function PlanFeaturePage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Redux State
  // ---------------------------------------------------------------------------

  const planFeatures = useSelector(selectPlanFeatures);
  const subscriptionPlans = useSelector(selectSubscriptionPlans);
  const features = useSelector(selectFeatures);

  const pagination = useSelector(selectPlanFeaturePagination);

  const loading = useSelector(selectPlanFeatureListLoading);

  const error = useSelector(selectPlanFeatureListError);

  const submitting = useSelector(selectCreatePlanFeatureLoading);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

  const [formErrors, setFormErrors] = useState({});

  const [search, setSearch] = useState("");

  // =============================================================================
  // Initial Plan Feature Fetch
  // =============================================================================

  useEffect(() => {
    dispatch(
      getPlanFeatures({
        page: 1,
        limit: pagination?.limit || 20,
        search,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getSubscriptionPlans({
        page: 1,
        limit: 100,
      }),
    );

    dispatch(
      getFeatures({
        page: 1,
        limit: 100,
      }),
    );
  }, [dispatch]);

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
      planId: form.planId.trim(),
      featureId: form.featureId.trim(),
      value: form.value.trim(),
    };

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    const validationErrors = validateCreatePlanFeature(values);

    if (!validationErrors.isValid) {
      setFormErrors(validationErrors.errors);

      return;
    }

    setFormErrors({});

    // -------------------------------------------------------------------------
    // Create Plan Feature
    // -------------------------------------------------------------------------

    const result = await dispatch(createPlanFeature(values));

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    if (createPlanFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Plan Feature Created",
        message:
          PLAN_FEATURE_MESSAGES.CREATED || "Plan feature created successfully.",
      });

      setIsCreateModalOpen(false);

      setForm(INITIAL_FORM);

      setFormErrors({});

      dispatch(
        getPlanFeatures({
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
      title: "Create Plan Feature Failed",
      message:
        result.payload?.message ||
        PLAN_FEATURE_MESSAGES.CREATE_FAILED ||
        "Failed to create plan feature.",
    });
  };

  // =============================================================================
  // Pagination / Search
  // =============================================================================

  const handlePageChange = (page) => {
    dispatch(
      getPlanFeatures({
        page,
        limit: pagination?.limit || 20,
        search,
      }),
    );
  };

  const handleLimitChange = (limit) => {
    dispatch(
      getPlanFeatures({
        page: 1,
        limit,
        search,
      }),
    );
  };

  const handleSearchChange = (value) => {
    setSearch(value);

    dispatch(
      getPlanFeatures({
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
    if (status === PLAN_FEATURE_STATUS.ACTIVE) {
      return "success";
    }

    return "neutral";
  };

  // =============================================================================
  // Table Columns
  // =============================================================================

  const columns = useMemo(
    () => [
      {
        key: "planId",
        label: "Plan",
        render: (planFeature) => planFeature.planId?.name || "-",
      },
      {
        key: "featureId",
        label: "Feature",
        render: (planFeature) => planFeature.featureId?.name || "-",
      },

      {
        key: "value",
        label: "Value",
        render: (planFeature) =>
          planFeature.value === null ||
          planFeature.value === undefined ||
          planFeature.value === ""
            ? "-"
            : String(planFeature.value),
      },

      {
        key: "status",
        label: "Status",
        render: (planFeature) => (
          <Badge variant={getStatusVariant(planFeature.status)}>
            {planFeature.status || "-"}
          </Badge>
        ),
      },
    ],
    [],
  );

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <PageContainer>
      {/* -----------------------------------------------------------------------
          Page Header
      ----------------------------------------------------------------------- */}

      <PageHeader
        title="Plan Features"
        description="Manage feature assignments for subscription plans."
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            Create Plan Feature
          </Button>
        }
      />

      {/* -----------------------------------------------------------------------
          Plan Feature Table
      ----------------------------------------------------------------------- */}

      <Table
        title="Plan Feature List"
        columns={columns}
        data={planFeatures}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search plan features..."
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        emptyMessage={error || "No plan features found."}
      />

      {/* -----------------------------------------------------------------------
          Create Plan Feature Modal
      ----------------------------------------------------------------------- */}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create Plan Feature"
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
              form="create-plan-feature-form"
              variant="primary"
              loading={submitting}
              loadingText="Creating..."
            >
              Create Plan Feature
            </Button>
          </>
        }
      >
        <form id="create-plan-feature-form" onSubmit={handleSubmit}>
          {/* -------------------------------------------------------------------
              Plan ID
          ------------------------------------------------------------------- */}

          <FormField
            label="Subscription Plan"
            name="planId"
            required
            error={formErrors.planId}
          >
            <Select
              name="planId"
              value={form.planId}
              onChange={handleFormChange}
              options={subscriptionPlans.map((plan) => ({
                value: plan._id,
                label: plan.name,
              }))}
              placeholder="Select subscription plan"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Feature ID
          ------------------------------------------------------------------- */}

          <FormField
            label="Feature"
            name="featureId"
            required
            error={formErrors.featureId}
          >
            <Select
              name="featureId"
              value={form.featureId}
              onChange={handleFormChange}
              options={features.map((feature) => ({
                value: feature._id,
                label: feature.name,
              }))}
              placeholder="Select feature"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Value
          ------------------------------------------------------------------- */}

          <FormField label="Value" name="value" error={formErrors.value}>
            <Input
              name="value"
              value={form.value}
              onChange={handleFormChange}
              placeholder="Optional feature value"
              disabled={submitting}
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

export default PlanFeaturePage;
