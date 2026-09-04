import { useEffect, useState } from "react";
import DataTable from "../../../components/datatable/dataTable";
import { FaEdit, FaEye, FaKey, FaTrash, FaPlus } from "react-icons/fa";
import Modal from "../../../components/modal/modal";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  changePassword,
  deleteUser,
  editUser,
  getUsers,
} from "../../../store/apiSlice/userSlice";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { getSubscriptionPlans } from "../../../store/apiSlice/subscriptionPlanSlice";
import { exportToCSV } from "../../../utils/exportToCSV";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";

const User = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getSubscriptionPlans());
  }, [dispatch]);

  const { users } = useSelector((state) => state.users);
  const { subscriptionPlans } = useSelector((state) => state.subscriptionPlans);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [userData, setUserData] = useState({
    loggedInUserId: loggedInUserId,
    adminUserPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    subscriptionPlan: "",
    password: "",
  });

  const handleChangeUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    if (type === "edit") {
      setUserData({
        _id: user._id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        subscriptionPlan: user.subscriptionPlan || "",
      });
    } else if (type === "delete") {
      setUserData({
        loggedInUserId: loggedInUserId,
        adminUserPassword: "",
        _id: user._id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        subscriptionPlan: user.subscriptionPlan || "",
      });
    } else if (type === "view") {
      setUserData({
        _id: user._id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        subscriptionPlan: user.subscriptionPlan || "",
      });
    } else if (type === "changePassword") {
      setUserData({
        _id: user._id || "",
        password: "",
      });
    } else {
      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        subscriptionPlan: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setUserData({
      loggedInUserId: loggedInUserId,
      adminUserPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      subscriptionPlan: "",
      password: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!userData.firstName) {
        showToast("First name is required!", "error");
        return;
      } else if (!userData.lastName) {
        showToast("Last name is required!", "error");
        return;
      } else if (!userData.email) {
        showToast("Email is required!", "error");
        return;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        showToast("Please enter a valid email", "error");
        return;
      } else if (!userData.subscriptionPlan) {
        showToast("Subscription plan is required!", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(editUser(userData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("User updated successfully!", "success");
            dispatch(getUsers());
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update user", "error");
          }
        });
      }
    } else {
      if (!userData.firstName) {
        showToast("First name is required!", "error");
        return;
      } else if (!userData.lastName) {
        showToast("Last name is required!", "error");
        return;
      } else if (!userData.email) {
        showToast("Email is required!", "error");
        return;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        showToast("Please enter a valid email", "error");
      } else if (!userData.subscriptionPlan) {
        showToast("Subscription plan is required!", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addUser(userData)).then((res) => {
          if (res.payload.message === "User already exists.") {
            dispatch(stopLoading());
            showToast("Email already registerd.", "error");
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("User added successfully!", "success");
            dispatch(getUsers());
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add user", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!userData.adminUserPassword) {
      showToast("Admin password is required!", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteUser(userData)).then((res) => {
        if (res.payload.message === "Admin user password is wrong") {
          dispatch(stopLoading());
          showToast("Password is incorrect", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("User deleted successfully!", "success");
          dispatch(getUsers());
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete user", "error");
        }
      });
    }
  };

  const handleChangePassword = () => {
    if (!userData.password) {
      showToast("New password is required!", "error");
      return;
    } else {
      dispatch(changePassword(userData)).then((res) => {
        if (res.payload.success) {
          showToast("Password changed successfully!", "success");
          dispatch(getUsers());
          closeModal();
        } else {
          showToast("Failed to change password", "error");
        }
      });
    }
  };

  const data = users
    ?.filter((user) => user._id !== loggedInUserId)
    ?.map((user, index) => ({
      ...user,
      srNo: index + 1,
      name: `${user.firstName} ${user.lastName}`,
    }));

  const columns = [
    { header: "SR.NO", accessor: "srNo", filterType: "text" },
    { header: "Name", accessor: "name", filterType: "text" },
    { header: "Email", accessor: "email", filterType: "text" },
    {
      header: "Subscribed Plan",
      accessor: "subscriptionPlan",
      filterType: "text",
    },
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
        {
          icon: FaKey,
          onClick: (row) => openModal("changePassword", row),
          title: "Change Password",
          type: "changePassword",
        },
      ],
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">User Management</h2>
          <button className="btn-add" onClick={() => openModal("add")}>
            <FaPlus />
          </button>
          {selectedData?.length > 0 && (
            <>
              <button
                className="btn-export-selected"
                onClick={() =>
                  exportToCSV(
                    selectedData,
                    ["id", "firstName", "email"],
                    "selected-users.csv"
                  )
                }
              >
                Export CSV
              </button>
            </>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onSelectionChange={(selectedIds) => {
          const selected = users?.filter((_, i) => selectedIds.includes(i + 1));
          setSelectedData(selected);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View User"
            : modalType === "edit"
            ? "Edit User"
            : modalType === "delete"
            ? "Delete User"
            : modalType === "changePassword"
            ? "Change Password"
            : "Add New User"
        }
        footer={
          <>
            {modalType === "delete" ? (
              <button className="btn-danger" onClick={handleDelete}>
                Delete
              </button>
            ) : modalType === "view" ? (
              <button onClick={closeModal}>Close</button>
            ) : modalType === "changePassword" ? (
              <button className="btn-primary" onClick={handleChangePassword}>
                Change Password
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSave}>
                {modalType === "edit" ? "Update" : "Add"}
              </button>
            )}
          </>
        }
      >
        {modalType === "delete" ? (
          <>
            <p>
              Are you sure you want to delete user{" "}
              <strong>{userData?.firstName + " " + userData.lastName}</strong>?
            </p>
            <div className="input-group">
              <label>Admin Password</label>
              <input
                type="password"
                name="adminUserPassword"
                value={userData.adminUserPassword}
                onChange={handleChangeUserData}
                placeholder="Enter admin password"
              />
            </div>
          </>
        ) : modalType === "view" ? (
          <>
            <div className="user-details">
              <p>
                <strong>Name:</strong> {userData?.firstName}{" "}
                {userData?.lastName}
              </p>
              <p>
                <strong>Email:</strong> {userData?.email}
              </p>
              <p>
                <strong>Subscribed Plan:</strong> {userData?.subscriptionPlan}
              </p>
            </div>
          </>
        ) : modalType === "changePassword" ? (
          <>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChangeUserData}
                placeholder="Enter new password"
              />
            </div>
          </>
        ) : (
          <>
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleChangeUserData}
                placeholder="Enter first name"
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleChangeUserData}
                placeholder="Enter last name"
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChangeUserData}
                placeholder="Enter email address"
              />
            </div>

            <div className="input-group">
              <label>Subscription Plan</label>
              <select
                name="subscriptionPlan"
                value={userData.subscriptionPlan}
                onChange={handleChangeUserData}
              >
                <option value="">Select Subscription Plan</option>
                {subscriptionPlans?.map((plan) => (
                  <option key={plan._id} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default User;
