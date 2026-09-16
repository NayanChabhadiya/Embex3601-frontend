import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Table from "../../../components/common/table/Table.jsx";
import PageHeader from "../../../components/layout/page/components/PageHeader.jsx";
import Modal from "../../../components/common/modal/Modal.jsx";

import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanById,
} from "./store/subscription-plan.thunks.js";

import {
  selectSubscriptionPlans,
  selectSubscriptionPlansStatus,
  selectSubscriptionPlansError,
  selectSubscriptionPlansMeta,
  selectSelectedSubscriptionPlan,
  selectSelectedSubscriptionPlanStatus,
  selectSelectedSubscriptionPlanError,
} from "./store/subscription-plan.selectors.js";

function SubscriptionPlanPage() {
  const dispatch = useDispatch();

  const plans = useSelector(selectSubscriptionPlans);
  const status = useSelector(selectSubscriptionPlansStatus);
  const error = useSelector(selectSubscriptionPlansError);
  const meta = useSelector(selectSubscriptionPlansMeta);

  const selectedPlan = useSelector(selectSelectedSubscriptionPlan);

  const selectedPlanStatus = useSelector(selectSelectedSubscriptionPlanStatus);

  const selectedPlanError = useSelector(selectSelectedSubscriptionPlanError);

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [planData, setPlanData] = useState({
    _id: "",
    name: "",
    code: "",
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
          <p>Edit Subscription Plan</p>
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
