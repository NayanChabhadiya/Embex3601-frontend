import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../../components/layout/page/components/PageHeader.jsx";
import Table from "../../../components/common/table/Table.jsx";
import Modal from "../../../components/common/modal/Modal.jsx";
import Grid from "../../../components/common/grid/Grid.jsx";
import Badge from "../../../components/common/badge/Badge.jsx";

import {
  Input,
  Select,
  Textarea,
} from "../../../components/common/form/index.js";

import { Button } from "../../../components/common/index.js";

import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../../components/common/icons";

import { useToast } from "../../../components/common/toast/ToastProvider.jsx";

import {
  fetchPlanFeatures,
  createPlanFeature,
  updatePlanFeature,
  deletePlanFeature,
} from "./store/plan-feature.thunks.js";

import {
  selectPlanFeatures,
  selectPlanFeatureStatus,
} from "./store/plan-feature.selectors.js";

import { fetchSubscriptionPlans } from "../subscription-plans/store/subscription-plan.thunks.js";

import { selectSubscriptionPlans } from "../subscription-plans/store/subscription-plan.selectors.js";

import { fetchFeatures } from "../features/store/feature.thunks.js";

import { selectFeatures } from "../features/store/feature.selectors.js";

function PlanFeaturePage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ============================================================
  // Redux State
  // ============================================================

  const planFeatures = useSelector(selectPlanFeatures);
  const status = useSelector(selectPlanFeatureStatus);

  const subscriptionPlans = useSelector(selectSubscriptionPlans);
  const features = useSelector(selectFeatures);

  // ============================================================
  // Modal State
  // ============================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedPlanFeature, setSelectedPlanFeature] = useState(null);

  const [editingId, setEditingId] = useState(null);

  // ============================================================
  // Form State
  // ============================================================

  const [formData, setFormData] = useState({
    subscriptionPlanId: "",
    featureId: "",
    status: "ACTIVE",
  });

  // ============================================================
  // Initial Data
  // ============================================================

  useEffect(() => {
    dispatch(fetchPlanFeatures());
    dispatch(fetchSubscriptionPlans());
    dispatch(fetchFeatures());
  }, [dispatch]);

  // ============================================================
  // Form Change
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // Reset Form
  // ============================================================

  const resetForm = () => {
    setFormData({
      subscriptionPlanId: "",
      featureId: "",
      status: "ACTIVE",
    });

    setEditingId(null);
  };

  // ============================================================
  // Open Create Modal
  // ============================================================

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // ============================================================
  // View
  // ============================================================

  const handleView = (planFeature) => {
    setSelectedPlanFeature(planFeature);
    setIsViewModalOpen(true);
  };

  // ============================================================
  // Edit
  // ============================================================

  const handleEdit = (planFeature) => {
    setEditingId(planFeature._id);

    setFormData({
      subscriptionPlanId:
        planFeature.subscriptionPlanId?._id ||
        planFeature.subscriptionPlanId ||
        "",

      featureId: planFeature.featureId?._id || planFeature.featureId || "",

      status: planFeature.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ============================================================
  // Submit
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    let result;

    if (editingId) {
      result = await dispatch(
        updatePlanFeature({
          id: editingId,
          payload: formData,
        }),
      );
    } else {
      result = await dispatch(createPlanFeature(formData));
    }

    if (
      editingId
        ? updatePlanFeature.fulfilled.match(result)
        : createPlanFeature.fulfilled.match(result)
    ) {
      setIsModalOpen(false);
      resetForm();

      showToast({
        type: "success",
        title: editingId ? "Plan Feature Updated" : "Plan Feature Created",
        message: editingId
          ? "Plan feature updated successfully."
          : "Plan feature created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message:
        result?.payload ||
        (editingId
          ? "Failed to update plan feature."
          : "Failed to create plan feature."),
    });
  };

  // ============================================================
  // Delete
  // ============================================================

  const handleDelete = async (planFeature) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plan feature?",
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deletePlanFeature(planFeature._id));

    if (deletePlanFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Plan Feature Deleted",
        message: "Plan feature deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete plan feature.",
    });
  };

  // ============================================================
  // Table Columns
  // ============================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
    },

    {
      key: "subscriptionPlanId",
      label: "Subscription Plan",
      render: (row) => row.subscriptionPlanId?.name || "Unknown Plan",
    },

    {
      key: "featureId",
      label: "Feature",
      render: (row) => row.featureId?.name || "Unknown Feature",
    },

    {
      key: "status",
      label: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <ViewIcon size={5} onClick={() => handleView(row)} title="View" />

          <EditIcon size={5} onClick={() => handleEdit(row)} title="Edit" />

          <DeleteIcon
            size={5}
            onClick={() => handleDelete(row)}
            title="Delete"
          />
        </>
      ),
    },
  ];

  // ============================================================
  // Render
  // ============================================================

  return (
    <section>
      <PageHeader
        title="Plan Features"
        description="Manage features assigned to subscription plans."
        actions={
          <Button type="button" onClick={handleAdd}>
            Add Plan Feature
          </Button>
        }
      />

      <Table
        title="Plan Features"
        columns={columns}
        data={planFeatures}
        rowKey="_id"
        emptyMessage="No plan features found."
        loading={status === "loading"}
        searchPlaceholder="Search plan features..."
      />

      {/* =========================================================
          Add / Edit Modal
      ========================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingId ? "Edit Plan Feature" : "Add Plan Feature"}
        footer={
          <>
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" form="plan-feature-form">
              {editingId ? "Update Plan Feature" : "Create Plan Feature"}
            </Button>
          </>
        }
      >
        <form id="plan-feature-form" onSubmit={handleSubmit}>
          <Grid>
            <Select
              label="Subscription Plan"
              name="subscriptionPlanId"
              value={formData.subscriptionPlanId}
              onChange={handleChange}
              options={subscriptionPlans.map((plan) => ({
                value: plan._id,
                label: `${plan.name} (${plan.code})`,
              }))}
            />

            <Select
              label="Feature"
              name="featureId"
              value={formData.featureId}
              onChange={handleChange}
              options={features.map((feature) => ({
                value: feature._id,
                label: `${feature.name} (${feature.code})`,
              }))}
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                {
                  value: "ACTIVE",
                  label: "Active",
                },
                {
                  value: "INACTIVE",
                  label: "Inactive",
                },
              ]}
            />
          </Grid>
        </form>
      </Modal>

      {/* =========================================================
          View Modal
      ========================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPlanFeature(null);
        }}
        title="View Plan Feature"
      >
        {selectedPlanFeature && (
          <Grid columns={1}>
            <div>
              <strong>Subscription Plan</strong>

              <div>
                {selectedPlanFeature.subscriptionPlanId?.name || "Unknown Plan"}
              </div>
            </div>

            <div>
              <strong>Feature</strong>

              <div>
                {selectedPlanFeature.featureId?.name || "Unknown Feature"}
              </div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedPlanFeature.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Created At</strong>

              <div>
                {selectedPlanFeature.createdAt
                  ? new Date(selectedPlanFeature.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default PlanFeaturePage;
