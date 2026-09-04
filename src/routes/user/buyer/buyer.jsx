import React, { useEffect, useState } from "react";
import {
  addBuyer,
  deleteBuyer,
  getBuyersByUser,
  updateBuyer,
} from "../../../store/apiSlice/buyerSlice";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { formatRupees } from "../../../utils/formatters";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";

const Buyer = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getBuyersByUser(loggedInUserId));
  }, [dispatch]);

  const { buyers } = useSelector((state) => state.buyers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [buyerData, setBuyerData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    name: "",
    reference: "",
    mobileNo: "",
    address: "",
    gstNo: "",
  });

  const handleChangeBuyerData = (e) => {
    setBuyerData({
      ...buyerData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, buyer = null) => {
    setModalType(type);
    if (type === "view") {
      setBuyerData({
        loggedInUserId: loggedInUserId,
        _id: buyer._id,
        name: buyer.name,
        reference: buyer.reference,
        mobileNo: buyer.mobileNo,
        address: buyer.address,
        gstNo: buyer.gstNo,
      });
    } else if (type === "edit" || type === "add") {
      setBuyerData({
        loggedInUserId: loggedInUserId,
        _id: buyer ? buyer._id : "",
        name: buyer ? buyer.name : "",
        reference: buyer ? buyer.reference : "",
        mobileNo: buyer ? buyer.mobileNo : "",
        address: buyer ? buyer.address : "",
        gstNo: buyer ? buyer.gstNo : "",
      });
    } else if (type === "delete") {
      setBuyerData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: buyer._id,
        name: buyer.name,
        reference: buyer.reference,
        mobileNo: buyer.mobileNo,
        address: buyer.address,
        gstNo: buyer.gstNo,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setBuyerData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      name: "",
      reference: "",
      mobileNo: "",
      address: "",
      gstNo: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!buyerData.name) {
        showToast("Buyer name is required", "error");
        return;
      } else if (!buyerData.address) {
        showToast("Address is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateBuyer(buyerData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Buyer updated successfully", "success");
            dispatch(getBuyersByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update buyer", "error");
          }
        });
      }
    } else {
      if (!buyerData.name) {
        showToast("Buyer name is required", "error");
        return;
      } else if (!buyerData.address) {
        showToast("Address is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addBuyer(buyerData)).then((res) => {
          if (
            res.payload.message ===
            "Buyer with the same name and GST Number already exists."
          ) {
            dispatch(stopLoading());
            showToast(
              "Buyer with the same name and GST Number already exists.",
              "error"
            );
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Buyer added successfully", "success");
            dispatch(getBuyersByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add buyer", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!buyerData.password) {
      showToast("Password is required to delete the buyer", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteBuyer(buyerData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Buyer deleted successfully", "success");
          dispatch(getBuyerByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete buyer", "error");
        }
      });
    }
  };

  const data = buyers?.map((buyer, index) => ({
    ...buyer,
    srNo: index + 1,
    _id: buyer._id,
    name: buyer.name,
    mobileNo: buyer.mobileNo,
    address: buyer.address,
    gstNo: buyer.gstNo,
    pendingAmount:
      buyer?.monthlyJobWorks?.reduce(
        (acc, bill) => acc + (bill?.totalAmount || 0),
        0
      ) -
      buyer?.receivedAmountHistory?.reduce(
        (acc, payment) => acc + (payment?.amount || 0),
        0
      ),
  }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    { header: "Name", accessor: "name", filterType: "text" },
    { header: "Mobile No", accessor: "mobileNo", filterType: "text" },
    { header: "Address", accessor: "address", filterType: "text" },
    { header: "GST No", accessor: "gstNo", filterType: "text" },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
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

  const exportFields = [{ accessor: "name", header: "Name" }];
  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Buyer Management</h2>
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
        exportFields={exportFields}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Buyer"
            : modalType === "edit"
            ? "Edit Buyer"
            : modalType === "delete"
            ? "Delete Buyer"
            : "Add Buyer"
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
        {modalType === "view" && buyerData ? (
          <div>
            <p>
              <strong>Name:</strong> {buyerData.name}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={buyerData.name}
                onChange={handleChangeBuyerData}
                placeholder="Enter buyer name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="reference">Reference</label>
              <input
                type="text"
                name="reference"
                value={buyerData.reference}
                onChange={handleChangeBuyerData}
                placeholder="Enter buyer reference"
              />
            </div>
            <div className="input-group">
              <label htmlFor="address">address</label>
              <textarea
                name="address"
                value={buyerData.address}
                onChange={handleChangeBuyerData}
                placeholder="Enter item address"
              ></textarea>
            </div>
            <div className="input-group">
              <label>Mobile No</label>
              <input
                type="number"
                name="mobileNo"
                value={buyerData.mobileNo}
                onChange={handleChangeBuyerData}
                placeholder="Enter mobile number"
                onKeyDown={(e) => {
                  if (
                    e.keyCode === 38 ||
                    e.keyCode === 40 ||
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "-" ||
                    e.key === "."
                  ) {
                    e.preventDefault();
                  }
                }}
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>

            <div className="input-group">
              <label>GST No</label>
              <input
                type="text"
                name="gstNo"
                value={buyerData.gstNo}
                onChange={handleChangeBuyerData}
                placeholder="Enter GST number"
              />
            </div>
          </>
        ) : modalType === "delete" && buyerData ? (
          <>
            <p>
              Are you sure you want to delete the buyer "{buyerData.name}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={buyerData.password}
                onChange={handleChangeBuyerData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Buyer;
