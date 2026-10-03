// =============================================================================
// Feature Page
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

import { createFeature, getFeatures } from "./store/feature.thunks.js";

import {
  selectFeatures,
  selectFeaturePagination,
  selectFeatureListLoading,
  selectFeatureListError,
  selectCreateFeatureLoading,
} from "./store/feature.selectors.js";

import { FEATURE_TYPES } from "./constants/feature.constants.js";

import { validateCreateFeature } from "./validations/feature.validation.js";

import FEATURE_MESSAGES from "./constants/feature.messages.js";

// =============================================================================
// Initial Form
// =============================================================================

const INITIAL_FORM = {
  name: "",
  code: "",
  type: FEATURE_TYPES.FUNCTIONALITY,
  description: "",
};

// =============================================================================
// Feature Page
// =============================================================================

function FeaturePage() {
  const dispatch = useDispatch();

  // ---------------------------------------------------------------------------
  // Redux State
  // ---------------------------------------------------------------------------

  const features = useSelector(selectFeatures);

  const pagination = useSelector(selectFeaturePagination);

  const loading = useSelector(selectFeatureListLoading);

  const error = useSelector(selectFeatureListError);

  const submitting = useSelector(selectCreateFeatureLoading);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

  const [formErrors, setFormErrors] = useState({});

  const [search, setSearch] = useState("");

  const { showToast } = useToast();

  // =============================================================================
  // Initial Feature Fetch
  // =============================================================================

  useEffect(() => {
    dispatch(
      getFeatures({
        page: 1,
        limit: pagination?.limit || 20,
      }),
    );
  }, [dispatch]);

  // =============================================================================
  // Select Options
  // =============================================================================

  const featureTypeOptions = useMemo(
    () => [
      {
        value: FEATURE_TYPES.MODULE,
        label: "Module",
      },
      {
        value: FEATURE_TYPES.FUNCTIONALITY,
        label: "Functionality",
      },
      {
        value: FEATURE_TYPES.LIMIT,
        label: "Limit",
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
    };

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    const validationErrors = validateCreateFeature(values);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});

    // -------------------------------------------------------------------------
    // Create Feature
    // -------------------------------------------------------------------------

    const result = await dispatch(createFeature(values));

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    if (createFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Feature Created",
        message: FEATURE_MESSAGES.CREATED || "Feature created successfully.",
      });

      setIsCreateModalOpen(false);
      setForm(INITIAL_FORM);
      setFormErrors({});

      dispatch(
        getFeatures({
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
      title: "Create Feature Failed",
      message:
        result.payload?.message ||
        FEATURE_MESSAGES.CREATE_FAILED ||
        "Failed to create feature.",
    });
  };

  // =============================================================================
  // Pagination / Search
  // =============================================================================

  const handlePageChange = (page) => {
    dispatch(
      getFeatures({
        page,
        limit: pagination?.limit || 20,
        search,
      }),
    );
  };

  const handleLimitChange = (limit) => {
    dispatch(
      getFeatures({
        page: 1,
        limit,
        search,
      }),
    );
  };

  const handleSearchChange = (value) => {
    setSearch(value);

    dispatch(
      getFeatures({
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
    if (status === "active") {
      return "success";
    }

    return "neutral";
  };

  const getTypeVariant = (type) => {
    if (type === FEATURE_TYPES.MODULE) {
      return "primary";
    }

    if (type === FEATURE_TYPES.FUNCTIONALITY) {
      return "success";
    }

    if (type === FEATURE_TYPES.LIMIT) {
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
      label: "Feature Name",
      render: (feature) => feature.name || "-",
    },

    {
      key: "code",
      label: "Code",
      render: (feature) => feature.code || "-",
    },

    {
      key: "type",
      label: "Type",
      render: (feature) => (
        <Badge variant={getTypeVariant(feature.type)}>
          {feature.type || "-"}
        </Badge>
      ),
    },

    {
      key: "description",
      label: "Description",
      render: (feature) => feature.description || "-",
    },

    {
      key: "status",
      label: "Status",
      render: (feature) => (
        <Badge variant={getStatusVariant(feature.status)}>
          {feature.status || "-"}
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
        title="Features"
        description="Manage platform features and their availability."
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            Create Feature
          </Button>
        }
      />

      {/* -----------------------------------------------------------------------
          Feature Table
      ----------------------------------------------------------------------- */}

      <Table
        title="Feature List"
        columns={columns}
        data={features}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search features..."
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        emptyMessage={error || "No features found."}
      />

      {/* -----------------------------------------------------------------------
          Create Feature Modal
      ----------------------------------------------------------------------- */}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create Feature"
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
              form="create-feature-form"
              variant="primary"
              loading={submitting}
              loadingText="Creating..."
            >
              Create Feature
            </Button>
          </>
        }
      >
        <form id="create-feature-form" onSubmit={handleSubmit}>
          {/* -------------------------------------------------------------------
              Name
          ------------------------------------------------------------------- */}

          <FormField
            label="Feature Name"
            name="name"
            required
            error={formErrors.name}
          >
            <Input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Enter feature name"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Code
          ------------------------------------------------------------------- */}

          <FormField
            label="Feature Code"
            name="code"
            required
            error={formErrors.code}
          >
            <Input
              name="code"
              value={form.code}
              onChange={handleFormChange}
              placeholder="Enter feature code"
              required
              disabled={submitting}
            />
          </FormField>

          {/* -------------------------------------------------------------------
              Type
          ------------------------------------------------------------------- */}

          <FormField
            label="Feature Type"
            name="type"
            required
            error={formErrors.type}
          >
            <Select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              options={featureTypeOptions}
              placeholder="Select feature type"
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
              placeholder="Enter feature description"
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

export default FeaturePage;
