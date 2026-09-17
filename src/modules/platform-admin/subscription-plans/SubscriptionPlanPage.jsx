import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../../components/layout/page/components/PageHeader.jsx";
import Table from "../../../components/common/table/Table.jsx";
import Modal from "../../../components/common/modal/Modal.jsx";
import Grid from "../../../components/common/grid/Grid.jsx";
import {
  Input,
  MultiSelect,
  Select,
} from "../../../components/common/form/index.js";

import {
  fetchSubscriptionPlans,
  updateSubscriptionPlan,
} from "./store/subscription-plan.thunks.js";
import { fetchFeatures } from "../features/store/feature.thunks.js";

import {
  selectSubscriptionPlans,
  selectSubscriptionPlansStatus,
  selectSubscriptionPlansError,
  selectSubscriptionPlansMeta,
  selectSubscriptionPlanUpdateStatus,
  selectSubscriptionPlanUpdateError,
} from "./store/subscription-plan.selectors.js";
import { selectFeatures } from "../features/store/feature.selectors.js";
import { Button } from "../../../components/common/index.js";

function SubscriptionPlanPage() {
  const dispatch = useDispatch();

  const plans = useSelector(selectSubscriptionPlans);
  const status = useSelector(selectSubscriptionPlansStatus);
  const error = useSelector(selectSubscriptionPlansError);
  const meta = useSelector(selectSubscriptionPlansMeta);

  const features = useSelector(selectFeatures);

  const featureOptions = features.map((feature) => ({
    value: feature._id,
    label: feature.name,
    description: feature.description,
  }));

  const updateStatus = useSelector(selectSubscriptionPlanUpdateStatus);
  const updateError = useSelector(selectSubscriptionPlanUpdateError);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    dispatch(
      fetchSubscriptionPlans({
        page,
        limit,
        search,
      }),
    );
  }, [dispatch, page, limit, search]);

  useEffect(() => {
    dispatch(fetchFeatures({ page: 1, limit: 100 }));
  }, [dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [planData, setPlanData] = useState({
    _id: "",
    name: "",
    code: "",
    status: "",
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

  const openModal = (type, plan = null) => {
    setModalType(type);

    if (type === "view") {
      setPlanData({
        _id: plan._id,
        name: plan.name,
        code: plan.code,
        status: plan.status,
        description: plan.description ?? "",
        planType: plan.planType,
        billingInterval: plan.billingInterval,
        price: plan.price,
        currency: plan.currency,
        trialDays: plan.trialDays,
        maxCompanies: plan.maxCompanies,
        maxUsers: plan.maxUsers,
        storageLimitGB: plan.storageLimitGB,
        displayOrder: plan.displayOrder,
        features: plan.features ?? [],
      });
    } else if (type === "edit" || type === "add") {
      setPlanData({
        _id: plan?._id ?? "",
        name: plan?.name ?? "",
        code: plan?.code ?? "",
        status: plan?.status ?? "",
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
    } else if (type === "delete") {
      setPlanData({
        _id: plan?._id ?? "",
        name: plan?.name ?? "",
        code: plan?.code ?? "",
        status: plan?.status ?? "",
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
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);

    setPlanData({
      _id: "",
      name: "",
      code: "",
      status: "",
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
  };

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
      key: "status",
      label: "Status",
    },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div>
          <button type="button" onClick={() => openModal("view", row)}>
            View
          </button>

          <button type="button" onClick={() => openModal("edit", row)}>
            Edit
          </button>

          <button type="button" onClick={() => openModal("delete", row)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleChangePlanData = (event) => {
    const { name, value } = event.target;

    setPlanData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleChangePlanFeatures = (features) => {
    setPlanData((current) => ({
      ...current,
      features,
    }));
  };

  const handleUpdate = async () => {
    if (!planData._id) return;

    const payload = {
      name: planData.name,
      code: planData.code,
      description: planData.description,
      planType: planData.planType,
      billingInterval: planData.billingInterval,
      price: Number(planData.price),
      currency: planData.currency,
      trialDays: Number(planData.trialDays),
      maxCompanies: Number(planData.maxCompanies),
      maxUsers: Number(planData.maxUsers),
      storageLimitGB: Number(planData.storageLimitGB),
      displayOrder: Number(planData.displayOrder),
      features: planData.features,
    };

    try {
      await dispatch(
        updateSubscriptionPlan({
          id: planData._id,
          payload,
        }),
      ).unwrap();

      closeModal();

      dispatch(
        fetchSubscriptionPlans({
          page,
          limit,
          search,
        }),
      );
    } catch {
      // Redux updateError will contain the API error.
    }
  };

  return (
    <section>
      <PageHeader
        title="Subscription Plans"
        description="Manage Embex360 subscription plans."
      />

      {error && <p>{error}</p>}

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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Subscription Plan"
            : modalType === "edit"
              ? "Edit Subscription Plan"
              : modalType === "delete"
                ? "Delete Subscription Plan"
                : "Subscription Plan"
        }
        size="large"
        footer={
          modalType === "edit" ? (
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
          ) : null
        }
      >
        {modalType === "view" && planData ? (
          <div>
            <p>
              <strong>Name:</strong> {planData.name}
            </p>

            <p>
              <strong>Code:</strong> {planData.code}
            </p>

            <p>
              <strong>Status:</strong> {planData.status}
            </p>
          </div>
        ) : modalType === "edit" && planData ? (
          <Grid columns={4} gap={16}>
            <Input
              label="Plan Name"
              name="name"
              type="text"
              placeholder="Enter plan name"
              value={planData.name}
              onChange={handleChangePlanData}
              required
            />

            <Input
              label="Plan Code"
              name="code"
              type="text"
              placeholder="Enter plan code"
              value={planData.code}
              onChange={handleChangePlanData}
              required
            />

            <Input
              label="Price"
              name="price"
              type="number"
              placeholder="Enter price"
              value={planData.price}
              onChange={handleChangePlanData}
              required
            />

            <Input
              label="Currency"
              name="currency"
              type="text"
              placeholder="INR"
              value={planData.currency}
              onChange={handleChangePlanData}
              required
            />
            <Input
              label="Description"
              name="description"
              type="text"
              placeholder="Enter plan description"
              value={planData.description}
              onChange={handleChangePlanData}
            />

            <Select
              label="Plan Type"
              name="planType"
              value={planData.planType}
              onChange={handleChangePlanData}
              placeholder="Select plan type"
              options={[
                { value: "FREE", label: "Free" },
                { value: "PAID", label: "Paid" },
                { value: "CUSTOM", label: "Custom" },
              ]}
              required
            />

            <Select
              label="Billing Interval"
              name="billingInterval"
              value={planData.billingInterval}
              onChange={handleChangePlanData}
              placeholder="Select billing interval"
              options={[
                { value: "MONTHLY", label: "Monthly" },
                { value: "YEARLY", label: "Yearly" },
              ]}
              required
            />

            <Input
              label="Trial Days"
              name="trialDays"
              type="number"
              placeholder="Enter trial days"
              value={planData.trialDays}
              onChange={handleChangePlanData}
            />

            <Input
              label="Maximum Companies"
              name="maxCompanies"
              type="number"
              placeholder="Enter maximum companies"
              value={planData.maxCompanies}
              onChange={handleChangePlanData}
            />

            <Input
              label="Maximum Users"
              name="maxUsers"
              type="number"
              placeholder="Enter maximum users"
              value={planData.maxUsers}
              onChange={handleChangePlanData}
            />

            <Input
              label="Storage Limit (GB)"
              name="storageLimitGB"
              type="number"
              placeholder="Enter storage limit"
              value={planData.storageLimitGB}
              onChange={handleChangePlanData}
            />

            <Input
              label="Display Order"
              name="displayOrder"
              type="number"
              placeholder="Enter display order"
              value={planData.displayOrder}
              onChange={handleChangePlanData}
            />
            <MultiSelect
              label="Features"
              name="features"
              value={planData.features}
              onChange={handleChangePlanFeatures}
              options={featureOptions}
              placeholder="Select features"
              searchPlaceholder="Search features..."
            />
          </Grid>
        ) : modalType === "delete" && planData ? (
          <p>
            Are you sure you want to delete <strong>{planData.name}</strong>?
          </p>
        ) : null}
      </Modal>
    </section>
  );
}

export default SubscriptionPlanPage;
