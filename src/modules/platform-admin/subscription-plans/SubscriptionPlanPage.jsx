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

import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  activateSubscriptionPlan,
  deactivateSubscriptionPlan,
  deleteSubscriptionPlan,
  restoreSubscriptionPlan,
} from "./store/subscription-plan.thunks.js";

import {
  selectSubscriptionPlans,
  selectSubscriptionPlansStatus,
  selectSubscriptionPlansError,
  selectSubscriptionPlansMeta,
  selectSubscriptionPlanUpdateStatus,
  selectSubscriptionPlanUpdateError,
  selectSubscriptionPlanCreateStatus,
  selectSubscriptionPlanCreateError,
  selectSubscriptionPlanActivateStatus,
  selectSubscriptionPlanActivateError,
  selectSubscriptionPlanDeactivateStatus,
  selectSubscriptionPlanDeactivateError,
  selectSubscriptionPlanDeleteStatus,
  selectSubscriptionPlanDeleteError,
  selectSubscriptionPlanRestoreStatus,
  selectSubscriptionPlanRestoreError,
} from "./store/subscription-plan.selectors.js";

import { fetchFeatures } from "../features/store/feature.thunks.js";
import { selectFeatures } from "../features/store/feature.selectors.js";
import GridItem from "../../../components/common/grid/GridItem.jsx";
import { useToast } from "../../../components/common/toast/ToastProvider.jsx";

function SubscriptionPlanPage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ===========================================================================
  // Redux State
  // ===========================================================================

  const plans = useSelector(selectSubscriptionPlans);
  const meta = useSelector(selectSubscriptionPlansMeta);
  const status = useSelector(selectSubscriptionPlansStatus);
  const error = useSelector(selectSubscriptionPlansError);

  const createStatus = useSelector(selectSubscriptionPlanCreateStatus);
  const createError = useSelector(selectSubscriptionPlanCreateError);

  const updateStatus = useSelector(selectSubscriptionPlanUpdateStatus);
  const updateError = useSelector(selectSubscriptionPlanUpdateError);

  const activateStatus = useSelector(selectSubscriptionPlanActivateStatus);
  const activateError = useSelector(selectSubscriptionPlanActivateError);

  const deactivateStatus = useSelector(selectSubscriptionPlanDeactivateStatus);
  const deactivateError = useSelector(selectSubscriptionPlanDeactivateError);

  const deleteStatus = useSelector(selectSubscriptionPlanDeleteStatus);
  const deleteError = useSelector(selectSubscriptionPlanDeleteError);

  const restoreStatus = useSelector(selectSubscriptionPlanRestoreStatus);
  const restoreError = useSelector(selectSubscriptionPlanRestoreError);

  const features = useSelector(selectFeatures);

  // ===========================================================================
  // Feature Options
  // ===========================================================================

  const featureOptions = features.map((feature) => ({
    value: feature._id,
    label: feature.name,
    description: feature.description,
  }));

  // ===========================================================================
  // List State
  // ===========================================================================

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isDeleted, setIsDeleted] = useState(false);
  const [filters, setFilters] = useState({});

  // ===========================================================================
  // Modal State
  // ===========================================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // ===========================================================================
  // Action State
  // ===========================================================================

  const actionLoading =
    createStatus === "loading" ||
    updateStatus === "loading" ||
    activateStatus === "loading" ||
    deactivateStatus === "loading" ||
    deleteStatus === "loading" ||
    restoreStatus === "loading";

  // ===========================================================================
  // Subscription Plan Form State
  // ===========================================================================

  const getEmptyPlanData = () => ({
    _id: "",
    name: "",
    code: "",
    status: "active",
    description: "",
    planType: "",
    billingInterval: "",
    price: "",
    currency: "INR",
    trialDays: "",
    maxCompanies: "",
    maxUsers: "",
    storageLimitGB: "",
    displayOrder: "",
    features: [],
  });

  const [planData, setPlanData] = useState(getEmptyPlanData());

  // ===========================================================================
  // Fetch Subscription Plans
  // ===========================================================================

  useEffect(() => {
    dispatch(
      fetchSubscriptionPlans({
        page,
        limit,
        search,
        isDeleted,
        ...filters,
      }),
    );
  }, [dispatch, page, limit, search, isDeleted, filters]);

  // ===========================================================================
  // Fetch Features
  // ===========================================================================

  useEffect(() => {
    dispatch(
      fetchFeatures({
        page: 1,
        limit: 100,
        isDeleted: false,
      }),
    );
  }, [dispatch]);

  // ===========================================================================
  // Reset Form
  // ===========================================================================

  const resetPlanData = () => {
    setPlanData(getEmptyPlanData());
  };

  // ===========================================================================
  // Open Modal
  // ===========================================================================

  const openModal = async (type, plan = null) => {
    setModalType(type);

    setPlanData({
      _id: plan?._id ?? "",
      name: plan?.name ?? "",
      code: plan?.code ?? "",
      status: plan?.status ?? "active",
      description: plan?.description ?? "",
      planType: plan?.planType ?? "",
      billingInterval: plan?.billingInterval ?? "",
      price: plan?.price ?? "",
      currency: plan?.currency ?? "INR",
      trialDays: plan?.trialDays ?? "",
      maxCompanies: plan?.maxCompanies ?? "",
      maxUsers: plan?.maxUsers ?? "",
      storageLimitGB: plan?.storageLimitGB ?? "",
      displayOrder: plan?.displayOrder ?? "",
      features: plan?.features ?? [],
    });

    setIsModalOpen(true);

    // -------------------------------------------------------------------------
    // View -> GET /subscription-plans/:id
    // -------------------------------------------------------------------------

    if (type === "view" && plan?._id) {
      const result = await dispatch(fetchSubscriptionPlanById(plan._id));

      if (fetchSubscriptionPlanById.fulfilled.match(result)) {
        const data = result.payload;

        setPlanData({
          _id: data?._id ?? plan._id,
          name: data?.name ?? "",
          code: data?.code ?? "",
          status: data?.status ?? "active",
          description: data?.description ?? "",
          planType: data?.planType ?? "",
          billingInterval: data?.billingInterval ?? "",
          price: data?.price ?? "",
          currency: data?.currency ?? "INR",
          trialDays: data?.trialDays ?? "",
          maxCompanies: data?.maxCompanies ?? "",
          maxUsers: data?.maxUsers ?? "",
          storageLimitGB: data?.storageLimitGB ?? "",
          displayOrder: data?.displayOrder ?? "",
          features: data?.features ?? [],
        });
      }
    }
  };

  // ===========================================================================
  // Close Modal
  // ===========================================================================

  const closeModal = () => {
    if (actionLoading) {
      return;
    }

    setIsModalOpen(false);
    setModalType(null);
    resetPlanData();
  };

  // ===========================================================================
  // Form Change
  // ===========================================================================

  const handleChangePlanData = (event) => {
    const { name, value } = event.target;

    setPlanData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ===========================================================================
  // Feature Change
  // ===========================================================================

  const handleChangePlanFeatures = (features) => {
    setPlanData((current) => ({
      ...current,
      features,
    }));
  };

  // ===========================================================================
  // Refresh Subscription Plans
  // ===========================================================================

  const refreshPlans = () => {
    dispatch(
      fetchSubscriptionPlans({
        page,
        limit,
        search,
        isDeleted,
        ...filters,
      }),
    );
  };

  // ===========================================================================
  // Create Subscription Plan
  // ===========================================================================

  const handleCreate = async () => {
    const payload = {
      name: planData.name,
      code: planData.code,
      description: planData.description,
      planType: planData.planType,
      billingInterval: planData.billingInterval,
      price: Number(planData.price),
      currency: planData.currency,
      trialDays: Number(planData.trialDays || 0),
      maxCompanies: Number(planData.maxCompanies || 0),
      maxUsers: Number(planData.maxUsers || 0),
      storageLimitGB: Number(planData.storageLimitGB || 0),
      displayOrder: Number(planData.displayOrder || 0),
      features: planData.features,
    };

    const result = await dispatch(createSubscriptionPlan(payload));

    if (createSubscriptionPlan.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Subscription plan created",
        message: "Subscription plan has been created successfully.",
      });

      closeModal();
      refreshPlans();

      return;
    }

    if (createSubscriptionPlan.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Subscription plan creation failed",
        message:
          result.payload ||
          "Unable to create subscription plan. Please check the entered details and try again.",
      });
    }
  };

  // ===========================================================================
  // Update Subscription Plan
  // ===========================================================================

  const handleUpdate = async () => {
    if (!planData._id) {
      showToast({
        type: "error",
        title: "Update failed",
        message: "Subscription plan identifier is missing.",
      });
      return;
    }

    const payload = {
      name: planData.name,
      code: planData.code,
      description: planData.description,
      planType: planData.planType,
      billingInterval: planData.billingInterval,
      price: Number(planData.price),
      currency: planData.currency,
      trialDays: Number(planData.trialDays || 0),
      maxCompanies: Number(planData.maxCompanies || 0),
      maxUsers: Number(planData.maxUsers || 0),
      storageLimitGB: Number(planData.storageLimitGB || 0),
      displayOrder: Number(planData.displayOrder || 0),
      features: planData.features,
    };

    const result = await dispatch(
      updateSubscriptionPlan({
        id: planData._id,
        payload,
      }),
    );

    if (updateSubscriptionPlan.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Plan updated",
        message: "Subscription plan has been updated successfully.",
      });

      closeModal();
      refreshPlans();
      return;
    }

    if (updateSubscriptionPlan.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Plan update failed",
        message: result.payload || "Unable to update subscription plan.",
      });
    }
  };

  // ===========================================================================
  // Activate Subscription Plan
  // ===========================================================================

  const handleActivate = async () => {
    if (!planData._id) {
      showToast({
        type: "error",
        title: "Activation failed",
        message: "Subscription plan identifier is missing.",
      });
      return;
    }

    const result = await dispatch(activateSubscriptionPlan(planData._id));

    if (activateSubscriptionPlan.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Plan activated",
        message: "Subscription plan has been activated successfully.",
      });

      closeModal();
      refreshPlans();
      return;
    }

    if (activateSubscriptionPlan.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Activation failed",
        message: result.payload || "Unable to activate subscription plan.",
      });
    }
  };

  // ===========================================================================
  // Deactivate Subscription Plan
  // ===========================================================================

  const handleDeactivate = async () => {
    if (!planData._id) {
      showToast({
        type: "error",
        title: "Deactivation failed",
        message: "Subscription plan identifier is missing.",
      });
      return;
    }

    const result = await dispatch(deactivateSubscriptionPlan(planData._id));

    if (deactivateSubscriptionPlan.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Plan deactivated",
        message: "Subscription plan has been deactivated successfully.",
      });

      closeModal();
      refreshPlans();
      return;
    }

    if (deactivateSubscriptionPlan.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Deactivation failed",
        message: result.payload || "Unable to deactivate subscription plan.",
      });
    }
  };

  // ===========================================================================
  // Delete Subscription Plan
  // ===========================================================================

  const handleDelete = async () => {
    if (!planData._id) {
      showToast({
        type: "error",
        title: "Delete failed",
        message: "Subscription plan identifier is missing.",
      });
      return;
    }

    const result = await dispatch(deleteSubscriptionPlan(planData._id));

    if (deleteSubscriptionPlan.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Plan deleted",
        message: "Subscription plan has been deleted successfully.",
      });

      closeModal();
      refreshPlans();
      return;
    }

    if (deleteSubscriptionPlan.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Plan deletion failed",
        message: result.payload || "Unable to delete subscription plan.",
      });
    }
  };

  // ===========================================================================
  // Restore Subscription Plan
  // ===========================================================================

  const handleRestore = async () => {
    if (!planData._id) {
      showToast({
        type: "error",
        title: "Restore failed",
        message: "Subscription plan identifier is missing.",
      });
      return;
    }

    const result = await dispatch(restoreSubscriptionPlan(planData._id));

    if (restoreSubscriptionPlan.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Plan restored",
        message: "Subscription plan has been restored successfully.",
      });

      closeModal();
      refreshPlans();
      return;
    }

    if (restoreSubscriptionPlan.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Plan restore failed",
        message: result.payload || "Unable to restore subscription plan.",
      });
    }
  };

  // ===========================================================================
  // Status Badge
  // ===========================================================================

  const renderStatusBadge = (status) => {
    if (status === "active") {
      return <Badge variant="success">Active</Badge>;
    }

    if (status === "inactive") {
      return <Badge variant="warning">Inactive</Badge>;
    }

    return <Badge>{status || "-"}</Badge>;
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
      label: "Plan Name",
      render: (row) => row.name,
    },
    {
      key: "planType",
      label: "Plan Type",
      render: (row) => row.planType || "-",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => `${row.currency ?? ""} ${row.price ?? 0}`,
    },
    {
      key: "billingInterval",
      label: "Billing",
      render: (row) => row.billingInterval || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => renderStatusBadge(row.status),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          {/* View */}
          <ViewIcon
            size={5}
            onClick={() => openModal("view", row)}
            title="View"
          />

          {/* Edit */}
          {!isDeleted && (
            <EditIcon
              size={5}
              onClick={() => openModal("edit", row)}
              title="Edit"
            />
          )}

          {/* Activate */}
          {!isDeleted && row.status === "inactive" && (
            <ActivateIcon
              size={5}
              onClick={() => openModal("activate", row)}
              title="Activate"
            />
          )}

          {/* Deactivate */}
          {!isDeleted && row.status === "active" && (
            <DeactivateIcon
              size={5}
              onClick={() => openModal("deactivate", row)}
              title="Deactivate"
            />
          )}

          {/* Delete */}
          {!isDeleted && (
            <DeleteIcon
              size={5}
              onClick={() => openModal("delete", row)}
              title="Delete"
            />
          )}

          {/* Restore */}
          {isDeleted && (
            <RestoreIcon
              size={5}
              onClick={() => openModal("restore", row)}
              title="Restore"
            />
          )}
        </>
      ),
    },
  ];

  // ===========================================================================
  // Modal Title
  // ===========================================================================

  const getModalTitle = () => {
    switch (modalType) {
      case "view":
        return "View Subscription Plan";

      case "add":
        return "Add Subscription Plan";

      case "edit":
        return "Edit Subscription Plan";

      case "activate":
        return "Activate Subscription Plan";

      case "deactivate":
        return "Deactivate Subscription Plan";

      case "delete":
        return "Delete Subscription Plan";

      case "restore":
        return "Restore Subscription Plan";

      default:
        return "Subscription Plan";
    }
  };

  // ===========================================================================
  // Modal Footer
  // ===========================================================================

  const renderModalFooter = () => {
    if (modalType === "view") {
      return (
        <Button type="button" onClick={closeModal}>
          Close
        </Button>
      );
    }

    if (modalType === "add") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleCreate}
            disabled={createStatus === "loading"}
          >
            {createStatus === "loading" ? "Creating..." : "Create Plan"}
          </Button>
        </>
      );
    }

    if (modalType === "edit") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleUpdate}
            disabled={updateStatus === "loading"}
          >
            {updateStatus === "loading" ? "Updating..." : "Update Plan"}
          </Button>
        </>
      );
    }

    if (modalType === "activate") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleActivate}
            disabled={activateStatus === "loading"}
          >
            {activateStatus === "loading" ? "Activating..." : "Activate"}
          </Button>
        </>
      );
    }

    if (modalType === "deactivate") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDeactivate}
            disabled={deactivateStatus === "loading"}
          >
            {deactivateStatus === "loading" ? "Deactivating..." : "Deactivate"}
          </Button>
        </>
      );
    }

    if (modalType === "delete") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleteStatus === "loading"}
          >
            {deleteStatus === "loading" ? "Deleting..." : "Delete"}
          </Button>
        </>
      );
    }

    if (modalType === "restore") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleRestore}
            disabled={restoreStatus === "loading"}
          >
            {restoreStatus === "loading" ? "Restoring..." : "Restore"}
          </Button>
        </>
      );
    }

    return null;
  };

  // ===========================================================================
  // Action Error
  // ===========================================================================

  const modalError =
    modalType === "add"
      ? createError
      : modalType === "edit"
        ? updateError
        : modalType === "activate"
          ? activateError
          : modalType === "deactivate"
            ? deactivateError
            : modalType === "delete"
              ? deleteError
              : modalType === "restore"
                ? restoreError
                : null;

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <section>
      <PageHeader
        title="Subscription Plans"
        description="Manage Embex360 subscription plans."
        actions={
          <Button type="button" onClick={() => openModal("add")}>
            Add Subscription Plan
          </Button>
        }
      />

      {/* =====================================================================
          Records Filter
      ====================================================================== */}

      <Select
        label="Records"
        value={isDeleted ? "deleted" : "active"}
        onChange={(event) => {
          setIsDeleted(event.target.value === "deleted");
          setPage(1);
        }}
        options={[
          {
            value: "active",
            label: "Active Subscription Plans",
          },
          {
            value: "deleted",
            label: "Deleted Subscription Plans",
          },
        ]}
      />

      {/* =====================================================================
          Subscription Plan Table
      ====================================================================== */}

      <Table
        title="Subscription Plans"
        columns={columns}
        data={plans}
        rowKey="_id"
        loading={status === "loading"}
        emptyMessage="No subscription plans found."
        pagination={meta}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search subscription plans..."
      />

      {/* =====================================================================
          Subscription Plan Modal
      ====================================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={getModalTitle()}
        size="large"
        footer={renderModalFooter()}
      >
        {/* ===================================================================
            View
        ==================================================================== */}

        {modalType === "view" && (
          <Grid columns={3} gap={16}>
            <GridItem>
              <p>
                <strong>Name:</strong> {planData.name || "-"}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Code:</strong> {planData.code || "-"}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Status:</strong> {renderStatusBadge(planData.status)}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Plan Type:</strong> {planData.planType || "-"}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Billing:</strong> {planData.billingInterval || "-"}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Price:</strong> {planData.currency}{" "}
                {planData.price ?? 0}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Trial Days:</strong> {planData.trialDays ?? 0}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Maximum Companies:</strong> {planData.maxCompanies ?? 0}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Maximum Users:</strong> {planData.maxUsers ?? 0}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Storage:</strong> {planData.storageLimitGB ?? 0} GB
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Display Order:</strong> {planData.displayOrder ?? 0}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>ID:</strong> {planData._id || "-"}
              </p>
            </GridItem>

            <GridItem columnSpan={3}>
              <p>
                <strong>Description:</strong> {planData.description || "-"}
              </p>
            </GridItem>

            <GridItem columnSpan={3}>
              <p>
                <strong>Features:</strong>
              </p>

              {planData.features?.length > 0 ? (
                <div>
                  {planData.features.map((featureId) => {
                    const feature = features.find(
                      (item) => item._id === featureId,
                    );

                    return (
                      <Badge key={featureId}>
                        {feature?.name ?? featureId}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p>-</p>
              )}
            </GridItem>
          </Grid>
        )}

        {/* ===================================================================
            Create / Edit
        ==================================================================== */}

        {(modalType === "add" || modalType === "edit") && (
          <Grid columns={4} gap={16}>
            <GridItem>
              <Input
                label="Plan Name"
                name="name"
                type="text"
                placeholder="Enter plan name"
                value={planData.name}
                onChange={handleChangePlanData}
                required
              />
            </GridItem>

            <GridItem>
              <Input
                label="Plan Code"
                name="code"
                type="text"
                placeholder="Enter plan code"
                value={planData.code}
                onChange={handleChangePlanData}
                disabled={modalType === "edit"}
                required={modalType === "add"}
              />
            </GridItem>

            <GridItem>
              <Select
                label="Plan Type"
                name="planType"
                value={planData.planType}
                onChange={handleChangePlanData}
                placeholder="Select plan type"
                options={[
                  { value: "free", label: "Free" },
                  { value: "basic", label: "Basic" },
                  {
                    value: "professional",
                    label: "Professional",
                  },
                  { value: "business", label: "Business" },
                  { value: "enterprise", label: "Enterprise" },
                  { value: "custom", label: "Custom" },
                ]}
                required
              />
            </GridItem>

            <GridItem>
              <Select
                label="Billing Interval"
                name="billingInterval"
                value={planData.billingInterval}
                onChange={handleChangePlanData}
                placeholder="Select billing interval"
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  {
                    value: "half_yearly",
                    label: "Half Yearly",
                  },
                  { value: "yearly", label: "Yearly" },
                  { value: "lifetime", label: "Lifetime" },
                ]}
                required
              />
            </GridItem>

            <GridItem columnSpan={4}>
              <Textarea
                label="Description"
                name="description"
                placeholder="Enter plan description"
                value={planData.description}
                onChange={handleChangePlanData}
                rows={4}
              />
            </GridItem>

            <GridItem>
              <Input
                label="Price"
                name="price"
                type="number"
                placeholder="Enter price"
                value={planData.price}
                onChange={handleChangePlanData}
                required
              />
            </GridItem>

            <GridItem>
              <Select
                label="Currency"
                name="currency"
                value={planData.currency}
                onChange={handleChangePlanData}
                placeholder="Select currency"
                options={[
                  {
                    value: "INR",
                    label: "INR - Indian Rupee",
                  },
                  {
                    value: "USD",
                    label: "USD - US Dollar",
                  },
                  {
                    value: "EUR",
                    label: "EUR - Euro",
                  },
                ]}
                required
              />
            </GridItem>

            <GridItem>
              <Input
                label="Trial Days"
                name="trialDays"
                type="number"
                placeholder="Enter trial days"
                value={planData.trialDays}
                onChange={handleChangePlanData}
              />
            </GridItem>

            <GridItem>
              <Input
                label="Maximum Companies"
                name="maxCompanies"
                type="number"
                placeholder="Enter maximum companies"
                value={planData.maxCompanies}
                onChange={handleChangePlanData}
              />
            </GridItem>

            <GridItem>
              <Input
                label="Maximum Users"
                name="maxUsers"
                type="number"
                placeholder="Enter maximum users"
                value={planData.maxUsers}
                onChange={handleChangePlanData}
              />
            </GridItem>

            <GridItem>
              <Input
                label="Storage Limit (GB)"
                name="storageLimitGB"
                type="number"
                placeholder="Enter storage limit"
                value={planData.storageLimitGB}
                onChange={handleChangePlanData}
              />
            </GridItem>

            <GridItem>
              <Input
                label="Display Order"
                name="displayOrder"
                type="number"
                placeholder="Enter display order"
                value={planData.displayOrder}
                onChange={handleChangePlanData}
              />
            </GridItem>

            <GridItem columnSpan={4}>
              <MultiSelect
                label="Features"
                name="features"
                value={planData.features}
                onChange={handleChangePlanFeatures}
                options={featureOptions}
                placeholder="Select features"
                searchPlaceholder="Search features..."
              />
            </GridItem>

            {modalError && (
              <GridItem columnSpan={4}>
                <p>{modalError}</p>
              </GridItem>
            )}
          </Grid>
        )}

        {/* ===================================================================
            Activate
        ==================================================================== */}

        {modalType === "activate" && (
          <p>
            Are you sure you want to activate <strong>{planData.name}</strong>?
          </p>
        )}

        {/* ===================================================================
            Deactivate
        ==================================================================== */}

        {modalType === "deactivate" && (
          <p>
            Are you sure you want to deactivate <strong>{planData.name}</strong>
            ?
          </p>
        )}

        {/* ===================================================================
            Delete
        ==================================================================== */}

        {modalType === "delete" && (
          <p>
            Are you sure you want to delete <strong>{planData.name}</strong>?
          </p>
        )}

        {/* ===================================================================
            Restore
        ==================================================================== */}

        {modalType === "restore" && (
          <p>
            Are you sure you want to restore <strong>{planData.name}</strong>?
          </p>
        )}
      </Modal>
    </section>
  );
}

export default SubscriptionPlanPage;
