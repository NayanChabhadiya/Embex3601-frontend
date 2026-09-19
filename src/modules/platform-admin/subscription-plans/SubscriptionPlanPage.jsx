import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../../components/layout/page/components/PageHeader.jsx";
import Table from "../../../components/common/table/Table.jsx";
import Modal from "../../../components/common/modal/Modal.jsx";
import Grid from "../../../components/common/grid/Grid.jsx";
import Badge from "../../../components/common/badge/Badge.jsx";

import {
  Input,
  MultiSelect,
  Select,
  Textarea,
} from "../../../components/common/form/index.js";

import { Button } from "../../../components/common/index.js";

import {
  ActivateIcon,
  DeactivateIcon,
  DeleteIcon,
  EditIcon,
  RestoreIcon,
  ViewIcon,
} from "../../../components/common/icons";

import { useToast } from "../../../components/common/toast/ToastProvider.jsx";
import {
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "./store/subscription-plan.thunks.js";
import {
  selectSubscriptionPlans,
  selectSubscriptionPlanStatus,
} from "./store/subscription-plan.selectors.js";

function SubscriptionPlanPage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const plans = useSelector(selectSubscriptionPlans);

  const status = useSelector(selectSubscriptionPlanStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setIsViewModalOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);

    setFormData({
      name: plan.name ?? "",
      code: plan.code ?? "",
      description: plan.description ?? "",
      status: plan.status ?? "ACTIVE",
    });

    setIsModalOpen(true);
  };

  const handleDelete = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      status: formData.status,
    };

    if (selectedPlan) {
      const result = await dispatch(
        updateSubscriptionPlan({
          id: selectedPlan._id,
          payload,
        }),
      );

      if (updateSubscriptionPlan.fulfilled.match(result)) {
        setIsModalOpen(false);
        setSelectedPlan(null);

        setFormData({
          name: "",
          code: "",
          description: "",
          status: "ACTIVE",
        });

        showToast({
          type: "success",
          title: "Subscription Plan Updated",
          message: "Subscription plan updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update subscription plan.",
      });

      return;
    }

    const result = await dispatch(createSubscriptionPlan(payload));

    if (createSubscriptionPlan.fulfilled.match(result)) {
      setIsModalOpen(false);

      setFormData({
        name: "",
        code: "",
        description: "",
        status: "ACTIVE",
      });

      showToast({
        type: "success",
        title: "Subscription Plan Created",
        message: "Subscription plan created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create subscription plan.",
    });
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete?._id) {
      return;
    }

    const result = await dispatch(deleteSubscriptionPlan(planToDelete._id));

    if (deleteSubscriptionPlan.fulfilled.match(result)) {
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);

      showToast({
        type: "success",
        title: "Subscription Plan Deleted",
        message: "Subscription plan deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete subscription plan.",
    });
  };

  // ===========================================================================
  // Table Columns
  // ===========================================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "code",
      label: "Code",
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

  return (
    <section>
      <PageHeader
        title="Subscription Plans"
        description="Manage Embex360 subscription plans."
        actions={
          <Button
            type="button"
            onClick={() => {
              setSelectedPlan(null);

              setFormData({
                name: "",
                code: "",
                description: "",
                status: "ACTIVE",
              });

              setIsModalOpen(true);
            }}
          >
            Add Subscription Plan
          </Button>
        }
      />

      <Table
        title="Subscription Plans"
        columns={columns}
        data={plans}
        rowKey="_id"
        emptyMessage="No subscription plans found."
        loading={status === "loading"}
        searchPlaceholder="Search subscription plans..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedPlan ? "Edit Subscription Plan" : "Add Subscription Plan"
        }
        footer={
          <>
            <Button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" form="subscription-plan-form">
              {selectedPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </>
        }
      >
        <form id="subscription-plan-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter plan name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter plan code"
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

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </Grid>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPlan(null);
        }}
        title="View Subscription Plan"
      >
        {selectedPlan && (
          <Grid columns={1}>
            <div>
              <strong>Name</strong>
              <div>{selectedPlan.name}</div>
            </div>

            <div>
              <strong>Code</strong>
              <div>{selectedPlan.code}</div>
            </div>

            <div>
              <strong>Status</strong>
              <div>
                <Badge>{selectedPlan.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Description</strong>
              <div>{selectedPlan.description || "No description"}</div>
            </div>
          </Grid>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
        title="Delete Subscription Plan"
        footer={
          <>
            <Button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setPlanToDelete(null);
              }}
            >
              Cancel
            </Button>

            <Button type="button" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{planToDelete?.name}</strong>?
        </p>

        <p>
          This action will remove the subscription plan from the active list.
        </p>
      </Modal>
    </section>
  );
}

export default SubscriptionPlanPage;
