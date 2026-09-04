import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { useEffect, useState } from "react";
import {
  addSupplierCategory,
  deleteSupplierCategory,
  getSupplierCategoriesByUser,
  updateSupplierCategory,
} from "../../../store/apiSlice/supplierCategorySlice";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";

const SupplierCategories = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getSupplierCategoriesByUser(loggedInUserId));
  }, [dispatch]);

  const { supplierCategories } = useSelector(
    (state) => state.supplierCategories
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [supplierCategoryData, setSupplierCategoryData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    name: "",
    description: "",
  });

  const handleChangeSupplierCategoryData = (e) => {
    setSupplierCategoryData({
      ...supplierCategoryData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, supplierCategory = null) => {
    setModalType(type);
    if (type === "view") {
      setSupplierCategoryData({
        loggedInUserId: loggedInUserId,
        _id: supplierCategory._id,
        name: supplierCategory.name,
        description: supplierCategory.description,
      });
    } else if (type === "edit" || type === "add") {
      setSupplierCategoryData({
        loggedInUserId: loggedInUserId,
        _id: supplierCategory ? supplierCategory._id : "",
        name: supplierCategory ? supplierCategory.name : "",
        description: supplierCategory ? supplierCategory.description : "",
      });
    } else if (type === "delete") {
      setSupplierCategoryData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: supplierCategory._id,
        name: supplierCategory.name,
        description: supplierCategory.description,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setSupplierCategoryData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      name: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!supplierCategoryData.name) {
        showToast("Please enter a name for the supplier category.", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateSupplierCategory(supplierCategoryData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Supplier category updated successfully.", "success");
            dispatch(getSupplierCategoriesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update supplier category.", "error");
          }
        });
      }
    } else {
      if (!supplierCategoryData.name) {
        showToast("Please enter a name for the supplier category.", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addSupplierCategory(supplierCategoryData)).then((res) => {
          if (
            res.payload.message ===
            "Category with the same name is already exists."
          ) {
            dispatch(stopLoading());
            showToast(
              "Supplier category with the same name already exists.",
              "error"
            );
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Supplier category added successfully.", "success");
            dispatch(getSupplierCategoriesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add supplier category.", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!supplierCategoryData.password) {
      showToast("Please enter your password to confirm deletion.", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteSupplierCategory(supplierCategoryData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Supplier category deleted successfully.", "success");
          dispatch(getSupplierCategoriesByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete supplier category.", "error");
        }
      });
    }
  };

  const data = supplierCategories?.map((category, index) => ({
    ...category,
    srNo: index + 1,
    name: category.name,
    description: category.description,
  }));

  const columns = [
    { header: "Sr.No", accessor: "srNo", filterType: "text" },
    { header: "Name", accessor: "name", filterType: "text" },
    { header: "Description", accessor: "description", filterType: "text" },
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
          <h2 className="page-title">Supplier Category Management</h2>
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
            ? "View Supplier Category"
            : modalType === "edit"
            ? "Edit Supplier Category"
            : modalType === "delete"
            ? "Delete Supplier Category"
            : "Add Supplier Category"
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
        {modalType === "view" && supplierCategoryData ? (
          <div>
            <p>
              <strong>Name:</strong> {supplierCategoryData.name}
            </p>

            <p>
              <strong>Description:</strong> {supplierCategoryData.description}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={supplierCategoryData.name}
                onChange={handleChangeSupplierCategoryData}
                placeholder="Enter category name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={supplierCategoryData.description}
                onChange={handleChangeSupplierCategoryData}
                placeholder="Enter item description"
              ></textarea>
            </div>
          </>
        ) : modalType === "delete" && supplierCategoryData ? (
          <>
            <p>
              Are you sure you want to delete the supplier category "
              {supplierCategoryData.name}"?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={supplierCategoryData.password}
                onChange={handleChangeSupplierCategoryData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default SupplierCategories;
