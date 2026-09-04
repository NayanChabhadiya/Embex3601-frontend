import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubscriptionPlan,
  deleteSubscriptionPlan,
  editSubscriptionPlan,
  getSubscriptionPlans,
} from "../../../store/apiSlice/subscriptionPlanSlice";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import { useToast } from "../../../contexts/toastContext/toastContext";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";

const SubscriptionPlan = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getSubscriptionPlans());
  }, [dispatch]);

  const { subscriptionPlans } = useSelector((state) => state.subscriptionPlans);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [subscriptionPlanData, setSubscriptionPlanData] = useState({
    loggedInUserId: loggedInUserId,
    adminUserPassword: "",
    _id: "",
    name: "",
    price: "",
    durationType: "",
    features: [],
  });

  const handleChangeSubscriptionPlanData = (e) => {
    setSubscriptionPlanData({
      ...subscriptionPlanData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, subscriptionPlan = null) => {
    setModalType(type);
    if (type === "view") {
      setSubscriptionPlanData({
        _id: subscriptionPlan._id,
        name: subscriptionPlan.name,
        price: subscriptionPlan.price,
        durationType: subscriptionPlan.durationType,
        features: subscriptionPlan.features,
      });
    } else if (type === "edit" || type === "add") {
      setSubscriptionPlanData({
        _id: subscriptionPlan ? subscriptionPlan._id : "",
        name: subscriptionPlan ? subscriptionPlan.name : "",
        price: subscriptionPlan ? subscriptionPlan.price : "",
        durationType: subscriptionPlan ? subscriptionPlan.durationType : "",
        features: subscriptionPlan ? subscriptionPlan.features : [],
      });
    } else if (type === "delete") {
      setSubscriptionPlanData({
        loggedInUserId: loggedInUserId,
        adminUserPassword: "",
        _id: subscriptionPlan._id,
        name: subscriptionPlan.name,
        price: subscriptionPlan.price,
        durationType: subscriptionPlan.durationType,
        features: subscriptionPlan.features,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setSubscriptionPlanData({
      loggedInUserId: loggedInUserId,
      adminUserPassword: "",
      _id: "",
      name: "",
      price: "",
      durationType: "",
      features: [],
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!subscriptionPlanData.name) {
        showToast("Please enter a valid name", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(editSubscriptionPlan(subscriptionPlanData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Subscription plan updated successfully", "success");
            dispatch(getSubscriptionPlans());
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update subscription plan", "error");
          }
        });
      }
    } else {
      if (!subscriptionPlanData.name) {
        showToast("Please enter a valid name", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addSubscriptionPlan(subscriptionPlanData)).then((res) => {
          if (res.payload.message === "Subscription plan already exists.") {
            dispatch(stopLoading());
            showToast("Same named subscription plan already exists.", "error");
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Subscription plan added successfully", "success");
            dispatch(getSubscriptionPlans());
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add subscription plan", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!subscriptionPlanData.adminUserPassword) {
      showToast("Please enter admin password", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteSubscriptionPlan(subscriptionPlanData)).then((res) => {
        if (res.payload.message === "Admin user password is wrong") {
          dispatch(stopLoading());
          showToast("Password is incorrect", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Subscription plan deleted successfully", "success");
          dispatch(getSubscriptionPlans());
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete subscription plan", "error");
        }
      });
    }
  };

  const data = subscriptionPlans?.map((plan, index) => ({
    ...plan,
    srNo: index + 1,
    name: plan.name,
    price: plan.price,
    durationType: plan.durationType,
    features: plan.features,
  }));

  const columns = [
    { header: "SR.NO", accessor: "srNo", filterType: "text" },
    { header: "Name", accessor: "name", filterType: "text" },
    { header: "Price", accessor: "price", filterType: "text" },
    { header: "Duration Type", accessor: "durationType", filterType: "text" },
    { header: "Features", accessor: "features", filterType: "text" },

    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => openModal("view", row),
          title: "View",
          type: "view",
        },
        {
          icon: FaEdit,
          onClick: (row) => openModal("edit", row),
          title: "Edit",
          type: "edit",
        },
        {
          icon: FaTrash,
          onClick: (row) => openModal("delete", row),
          title: "Delete",
          type: "delete",
        },
      ],
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Subscription Plan Management</h2>
          <button className="btn-add" onClick={() => openModal("add")}>
            <FaPlus />
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onSelectionChange={(selectedIds) => {
          const selected = selectedData?.filter((_, i) =>
            selectedIds.includes(i + 1)
          );
          setSelectedData(selected);
        }}
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
            : "Add Subscription Plan"
        }
        footer={
          <>
            {modalType === "delete" ? (
              <button className="btn-danger" onClick={handleDelete}>
                Delete
              </button>
            ) : modalType === "view" ? (
              <button onClick={closeModal}>Close</button>
            ) : (
              <button className="btn-primary" onClick={handleSave}>
                {modalType === "edit" ? "Update" : "Add"}
              </button>
            )}
          </>
        }
      >
        {modalType === "view" && subscriptionPlanData ? (
          <div>
            <p>
              <strong>Name:</strong> {subscriptionPlanData.name}
            </p>
            <p>
              <strong>Price:</strong> {subscriptionPlanData.price}
            </p>
            <p>
              <strong>Duration Type:</strong>{" "}
              {subscriptionPlanData.durationType}
            </p>
            <p>
              <strong>Features:</strong>{" "}
              {subscriptionPlanData.features.join(", ") || "--"}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={subscriptionPlanData.name}
              onChange={handleChangeSubscriptionPlanData}
              placeholder="Enter plan name"
            />
          </div>
        ) : modalType === "delete" && subscriptionPlanData ? (
          <>
            <p>
              Are you sure you want to delete the subscription plan "
              {subscriptionPlanData.name}"?
            </p>
            <div className="input-group">
              <label>Admin Password</label>
              <input
                type="password"
                name="adminUserPassword"
                value={subscriptionPlanData.adminUserPassword}
                onChange={handleChangeSubscriptionPlanData}
                placeholder="Enter admin password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default SubscriptionPlan;
