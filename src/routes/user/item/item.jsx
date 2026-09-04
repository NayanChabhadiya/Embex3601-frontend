import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  deleteItem,
  getItemsByUser,
  updateItem,
} from "../../../store/apiSlice/itemSlice";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";

const Item = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getItemsByUser(loggedInUserId));
  }, [dispatch]);

  const { items } = useSelector((state) => state.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [itemData, setItemData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    name: "",
    hsn: "",
    unitType: "",
    qty: "",
    description: "",
    pricePerUnit: "",
  });

  const handleChangeItemData = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    if (type === "view") {
      setItemData({
        loggedInUserId: loggedInUserId,
        _id: item._id,
        name: item.name,
        unitType: item.unitType,
        hsn: item.hsn,
        qty: item.qty,
        description: item.description,
        pricePerUnit: item.pricePerUnit,
      });
    } else if (type === "edit" || type === "add") {
      setItemData({
        loggedInUserId: loggedInUserId,
        _id: item ? item._id : "",
        name: item ? item.name : "",
        unitType: item ? item.unitType : "",
        hsn: item ? item.hsn : "",
        qty: item ? item.qty : "",
        description: item ? item.description : "",
        pricePerUnit: item ? item.pricePerUnit : "",
      });
    } else if (type === "delete") {
      setItemData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: item._id,
        name: item.name,
        unitType: item.unitType,
        qty: item.qty,
        description: item.description,
        pricePerUnit: item.pricePerUnit,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setItemData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      name: "",
      unitType: "",
      qty: "",
      description: "",
      pricePerUnit: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!itemData.name) {
        showToast("Please enter item name", "error");
        return;
      } else if (!itemData.unitType) {
        showToast("Please select unit type", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateItem(itemData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Item updated successfully", "success");
            dispatch(getItemsByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update item", "error");
          }
        });
      }
    } else {
      if (!itemData.name) {
        showToast("Please enter item name", "error");
        return;
      } else if (!itemData.unitType) {
        showToast("Please select unit type", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addItem(itemData)).then((res) => {
          if (
            res.payload.message === "Item with the same name is already exists."
          ) {
            showToast("Item with the same name already exists.", "error");
          } else if (res.payload.success) {
            showToast("Item added successfully", "success");
            dispatch(getItemsByUser(loggedInUserId));
            closeModal();
            dispatch(stopLoading());
          } else {
            showToast("Failed to add item", "error");
            dispatch(stopLoading());
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!itemData.password) {
      showToast("Please enter your password to confirm deletion", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteItem(itemData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Item deleted successfully", "success");
          dispatch(getItemsByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete item", "error");
        }
      });
    }
  };

  const data = items?.map((item, index) => ({
    ...item,
    srNo: index + 1,
    name: item.name,
    unitType: item.unitType,
    qty: item.qty,
    description: item.description,
    pricePerUnit: item.pricePerUnit,
  }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    { header: "Name", accessor: "name", filterType: "text" },
    { header: "Unit Type", accessor: "unitType", filterType: "text" },
    { header: "HSN", accessor: "hsn", filterType: "text" },
    { header: "Qty", accessor: "qty", filterType: "text" },
    { header: "Description", accessor: "description", filterType: "text" },
    { header: "Price", accessor: "pricePerUnit", filterType: "text" },
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
          <h2 className="page-title">Item Management</h2>
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
            ? "View Item"
            : modalType === "edit"
            ? "Edit Item"
            : modalType === "delete"
            ? "Delete Item"
            : "Add Item"
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
        {modalType === "view" && itemData ? (
          <div>
            <p>
              <strong>Name:</strong> {itemData.name}
            </p>
            <p>
              <strong>Price:</strong> {itemData.pricePerUnit}
            </p>
            <p>
              <strong>Description:</strong> {itemData.description}
            </p>
            <p>
              <strong>Unit Type:</strong> {itemData.unitType}
            </p>
            <p>
              <strong>Qty:</strong> {itemData.qty}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={itemData.name}
                onChange={handleChangeItemData}
                placeholder="Enter item name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="hsn">HSN</label>
              <input
                type="text"
                name="hsn"
                value={itemData.hsn}
                onChange={handleChangeItemData}
                placeholder="Enter HSN code"
              />
            </div>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="qty">Qty</label>
                  <input
                    type="number"
                    name="qty"
                    value={itemData.qty}
                    onChange={handleChangeItemData}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="unitType">Unit Type</label>
                  <select
                    name="unitType"
                    value={itemData.unitType}
                    onChange={handleChangeItemData}
                  >
                    <option value="">Select Unit Type</option>
                    <option value="KG">KG</option>
                    <option value="PCS">PCS</option>
                    <option value="BOX">BOX</option>
                    <option value="SET">SET</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={itemData.description}
                onChange={handleChangeItemData}
                placeholder="Enter item description"
              ></textarea>
            </div>
            <div className="input-group">
              <label htmlFor="pricePerUnit">Price Per Unit</label>
              <input
                type="number"
                name="pricePerUnit"
                value={itemData.pricePerUnit}
                onChange={handleChangeItemData}
                placeholder="Enter price per unit"
              />
            </div>
          </>
        ) : modalType === "delete" && itemData ? (
          <>
            <p>Are you sure you want to delete the item "{itemData.name}"?</p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={itemData.password}
                onChange={handleChangeItemData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Item;
