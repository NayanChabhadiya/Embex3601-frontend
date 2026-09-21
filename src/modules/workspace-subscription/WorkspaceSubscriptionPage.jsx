import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import { DeleteIcon, EditIcon, ViewIcon } from "../../components/common/icons";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

import {
  fetchWorkspaceSubscriptions,
  createWorkspaceSubscription,
  updateWorkspaceSubscription,
  deleteWorkspaceSubscription,
} from "./store/workspace-subscription.thunks.js";

import {
  selectWorkspaceSubscriptions,
  selectWorkspaceSubscriptionStatus,
} from "./store/workspace-subscription.selectors.js";

const WorkspaceSubscriptionPage = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ============================================================
  // Redux State
  // ============================================================

  const subscriptions = useSelector(selectWorkspaceSubscriptions);

  const status = useSelector(selectWorkspaceSubscriptionStatus);

  // ============================================================
  // Modal State
  // ============================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ============================================================
  // Selected / Editing Subscription
  // ============================================================

  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const [editingSubscription, setEditingSubscription] = useState(null);

  // ============================================================
  // Form State
  // ============================================================

  const [formData, setFormData] = useState({
    workspaceId: "",
    subscriptionPlanId: "",
    status: "ACTIVE",
    startDate: "",
    endDate: "",
    trialStartDate: "",
    trialEndDate: "",
    autoRenew: true,
    cancellationReason: "",
  });

  // ============================================================
  // Fetch Subscriptions
  // ============================================================

  useEffect(() => {
    dispatch(fetchWorkspaceSubscriptions());
  }, [dispatch]);

  // ============================================================
  // Form Change
  // ============================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ============================================================
  // Reset Form
  // ============================================================

  const resetForm = () => {
    setFormData({
      workspaceId: "",
      subscriptionPlanId: "",
      status: "ACTIVE",
      startDate: "",
      endDate: "",
      trialStartDate: "",
      trialEndDate: "",
      autoRenew: true,
      cancellationReason: "",
    });

    setEditingSubscription(null);
  };

  // ============================================================
  // Create
  // ============================================================

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // ============================================================
  // View
  // ============================================================

  const handleView = (subscription) => {
    setSelectedSubscription(subscription);
    setIsViewModalOpen(true);
  };

  // ============================================================
  // Edit
  // ============================================================

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);

    setFormData({
      workspaceId:
        subscription.workspaceId?._id || subscription.workspaceId || "",

      subscriptionPlanId:
        subscription.subscriptionPlanId?._id ||
        subscription.subscriptionPlanId ||
        "",

      status: subscription.status || "ACTIVE",

      startDate: subscription.startDate
        ? subscription.startDate.slice(0, 10)
        : "",

      endDate: subscription.endDate ? subscription.endDate.slice(0, 10) : "",

      trialStartDate: subscription.trialStartDate
        ? subscription.trialStartDate.slice(0, 10)
        : "",

      trialEndDate: subscription.trialEndDate
        ? subscription.trialEndDate.slice(0, 10)
        : "",

      autoRenew: subscription.autoRenew ?? true,

      cancellationReason: subscription.cancellationReason || "",
    });

    setIsModalOpen(true);
  };

  // ============================================================
  // Delete
  // ============================================================

  const handleDelete = async (subscription) => {
    const result = await dispatch(
      deleteWorkspaceSubscription(subscription._id),
    );

    if (deleteWorkspaceSubscription.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Subscription Deleted",
        message: "Workspace subscription deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete workspace subscription.",
    });
  };

  // ============================================================
  // Submit
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      workspaceId: formData.workspaceId,
      subscriptionPlanId: formData.subscriptionPlanId,
      status: formData.status,
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : null,
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null,
      trialStartDate: formData.trialStartDate
        ? new Date(formData.trialStartDate).toISOString()
        : null,
      trialEndDate: formData.trialEndDate
        ? new Date(formData.trialEndDate).toISOString()
        : null,
      autoRenew: formData.autoRenew,
      cancellationReason: formData.cancellationReason || null,
    };

    // ==========================================================
    // UPDATE
    // ==========================================================

    if (editingSubscription) {
      const result = await dispatch(
        updateWorkspaceSubscription({
          id: editingSubscription._id,
          payload,
        }),
      );

      if (updateWorkspaceSubscription.fulfilled.match(result)) {
        setIsModalOpen(false);
        resetForm();

        showToast({
          type: "success",
          title: "Subscription Updated",
          message: "Workspace subscription updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update workspace subscription.",
      });

      return;
    }

    // ==========================================================
    // CREATE
    // ==========================================================

    const result = await dispatch(createWorkspaceSubscription(payload));

    if (createWorkspaceSubscription.fulfilled.match(result)) {
      setIsModalOpen(false);
      resetForm();

      showToast({
        type: "success",
        title: "Subscription Created",
        message: "Workspace subscription created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create workspace subscription.",
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
      key: "workspaceId",
      label: "Workspace",
      render: (row) =>
        row.workspaceId?.name ||
        row.workspaceId?.code ||
        row.workspaceId ||
        "-",
    },

    {
      key: "subscriptionPlanId",
      label: "Subscription Plan",
      render: (row) =>
        row.subscriptionPlanId?.name ||
        row.subscriptionPlanId?.code ||
        row.subscriptionPlanId ||
        "-",
    },

    {
      key: "status",
      label: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },

    {
      key: "startDate",
      label: "Start Date",
      render: (row) =>
        row.startDate ? new Date(row.startDate).toLocaleDateString() : "-",
    },

    {
      key: "endDate",
      label: "End Date",
      render: (row) =>
        row.endDate ? new Date(row.endDate).toLocaleDateString() : "-",
    },

    {
      key: "autoRenew",
      label: "Auto Renew",
      render: (row) => <Badge>{row.autoRenew ? "Yes" : "No"}</Badge>,
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

  return (
    <section>
      {/* ======================================================
          Page Header
      ====================================================== */}

      <PageHeader
        title="Workspace Subscriptions"
        description="Manage workspace subscription plans and billing periods."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Subscription
          </Button>
        }
      />

      {/* ======================================================
          Subscription Table
      ====================================================== */}

      <Table
        title="Workspace Subscriptions"
        columns={columns}
        data={subscriptions}
        rowKey="_id"
        emptyMessage="No workspace subscriptions found."
        loading={status === "loading"}
        searchPlaceholder="Search workspace subscriptions..."
      />

      {/* ======================================================
          Create / Edit Modal
      ====================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={
          editingSubscription
            ? "Edit Workspace Subscription"
            : "Add Workspace Subscription"
        }
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

            <Button type="submit" form="workspace-subscription-form">
              {editingSubscription
                ? "Update Subscription"
                : "Create Subscription"}
            </Button>
          </>
        }
      >
        <form id="workspace-subscription-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Workspace ID"
              name="workspaceId"
              value={formData.workspaceId}
              onChange={handleChange}
              placeholder="Enter workspace ID"
            />

            <Input
              label="Subscription Plan ID"
              name="subscriptionPlanId"
              value={formData.subscriptionPlanId}
              onChange={handleChange}
              placeholder="Enter subscription plan ID"
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
                  value: "TRIAL",
                  label: "Trial",
                },
                {
                  value: "PAUSED",
                  label: "Paused",
                },
                {
                  value: "EXPIRED",
                  label: "Expired",
                },
                {
                  value: "CANCELLED",
                  label: "Cancelled",
                },
              ]}
            />

            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />

            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />

            <Input
              label="Trial Start Date"
              name="trialStartDate"
              type="date"
              value={formData.trialStartDate}
              onChange={handleChange}
            />

            <Input
              label="Trial End Date"
              name="trialEndDate"
              type="date"
              value={formData.trialEndDate}
              onChange={handleChange}
            />

            <label>
              <input
                type="checkbox"
                name="autoRenew"
                checked={formData.autoRenew}
                onChange={handleChange}
              />

              <span> Auto Renew</span>
            </label>

            <Input
              label="Cancellation Reason"
              name="cancellationReason"
              value={formData.cancellationReason}
              onChange={handleChange}
              placeholder="Enter cancellation reason"
            />
          </Grid>
        </form>
      </Modal>

      {/* ======================================================
          View Modal
      ====================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSubscription(null);
        }}
        title="View Workspace Subscription"
      >
        {selectedSubscription && (
          <Grid columns={1}>
            <div>
              <strong>Workspace</strong>

              <div>
                {selectedSubscription.workspaceId?.name ||
                  selectedSubscription.workspaceId?.code ||
                  selectedSubscription.workspaceId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Subscription Plan</strong>

              <div>
                {selectedSubscription.subscriptionPlanId?.name ||
                  selectedSubscription.subscriptionPlanId?.code ||
                  selectedSubscription.subscriptionPlanId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedSubscription.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Start Date</strong>

              <div>
                {selectedSubscription.startDate
                  ? new Date(
                      selectedSubscription.startDate,
                    ).toLocaleDateString()
                  : "-"}
              </div>
            </div>

            <div>
              <strong>End Date</strong>

              <div>
                {selectedSubscription.endDate
                  ? new Date(selectedSubscription.endDate).toLocaleDateString()
                  : "-"}
              </div>
            </div>

            <div>
              <strong>Trial Period</strong>

              <div>
                {selectedSubscription.trialStartDate
                  ? new Date(
                      selectedSubscription.trialStartDate,
                    ).toLocaleDateString()
                  : "-"}

                {" → "}

                {selectedSubscription.trialEndDate
                  ? new Date(
                      selectedSubscription.trialEndDate,
                    ).toLocaleDateString()
                  : "-"}
              </div>
            </div>

            <div>
              <strong>Auto Renew</strong>

              <div>
                <Badge>{selectedSubscription.autoRenew ? "Yes" : "No"}</Badge>
              </div>
            </div>

            <div>
              <strong>Cancellation Reason</strong>

              <div>{selectedSubscription.cancellationReason || "-"}</div>
            </div>

            <div>
              <strong>Created At</strong>

              <div>
                {selectedSubscription.createdAt
                  ? new Date(selectedSubscription.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
};

export default WorkspaceSubscriptionPage;
