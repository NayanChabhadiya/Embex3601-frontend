import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { useEffect, useState } from "react";
import {
  addPurchaseCompany,
  deletePurchaseCompany,
  getPurchaseCompanyByUser,
  updatePurchaseCompany,
} from "../../../store/apiSlice/purchaseCompanySlice";
import { FaEdit, FaEye, FaTrash, FaPlus, FaWallet } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
import { formatRupees } from "../../../utils/formatters";

const PurchaseCompanies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getPurchaseCompanyByUser(loggedInUserId));
  }, [dispatch]);

  const { purchaseCompanies } = useSelector((state) => state.purchaseCompanies);
  const { purchasedItems } = useSelector((state) => state.purchasedItems);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [purchaseCompanyData, setPurchaseCompanyData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    name: "",
    address: "",
    contactPersonName: "",
    mobileNo: "",
    gstNo: "",
  });

  const handleChangePurchaseCompanyData = (e) => {
    setPurchaseCompanyData({
      ...purchaseCompanyData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, purchaseCompany = null) => {
    setModalType(type);
    if (type === "view") {
      setPurchaseCompanyData({
        loggedInUserId: loggedInUserId,
        _id: purchaseCompany._id,
        name: purchaseCompany.name,
        address: purchaseCompany.address,
        contactPersonName: purchaseCompany.contactPersonName,
        mobileNo: purchaseCompany.mobileNo,
        gstNo: purchaseCompany.gstNo,
      });
    } else if (type === "edit" || type === "add") {
      setPurchaseCompanyData({
        loggedInUserId: loggedInUserId,
        _id: purchaseCompany ? purchaseCompany._id : "",
        name: purchaseCompany ? purchaseCompany.name : "",
        address: purchaseCompany ? purchaseCompany.address : "",
        contactPersonName: purchaseCompany
          ? purchaseCompany.contactPersonName
          : "",
        mobileNo: purchaseCompany ? purchaseCompany.mobileNo : "",
        gstNo: purchaseCompany ? purchaseCompany.gstNo : "",
      });
    } else if (type === "delete") {
      setPurchaseCompanyData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: purchaseCompany._id,
        name: purchaseCompany.name,
        address: purchaseCompany.address,
        contactPersonName: purchaseCompany.contactPersonName,
        mobileNo: purchaseCompany.mobileNo,
        gstNo: purchaseCompany.gstNo,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setPurchaseCompanyData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      name: "",
      address: "",
      contactPersonName: "",
      mobileNo: "",
      gstNo: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!purchaseCompanyData.name) {
        showToast("Please enter purchase company name", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updatePurchaseCompany(purchaseCompanyData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Purchase company updated successfully", "success");
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update purchase company", "error");
          }
        });
      }
    } else {
      if (!purchaseCompanyData.name) {
        showToast("Please enter purchase company name", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addPurchaseCompany(purchaseCompanyData)).then((res) => {
          if (
            res.payload.message ===
            "Purchase company with the same name is already exists."
          ) {
            dispatch(stopLoading());
            showToast(
              "Purchase company with the same name already exists.",
              "error",
            );
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Purchase company added successfully", "success");
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add purchase company", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!purchaseCompanyData.password) {
      showToast("Please enter your password", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deletePurchaseCompany(purchaseCompanyData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Purchase company deleted successfully", "success");
          dispatch(getPurchaseCompanyByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete purchase company", "error");
        }
      });
    }
  };

  const datas = purchaseCompanies?.map((purchaseCompany, index) => {
    const pBills =
      purchasedItems?.filter(
        (bill) => bill.purchaseCompany === purchaseCompany._id,
      ) || [];

    const totalPurchase = pBills?.reduce(
      (sum, bill) => sum + (bill?.totalAmount || 0),
      0,
    );

    const totalPaid = purchaseCompany?.paidAmountHistory?.reduce(
      (sum, payment) => sum + (payment?.amount || 0),
      0,
    );

    console.log(totalPurchase);
    return {
      ...purchaseCompany,
      _id: purchaseCompany._id,
      srNo: index + 1,
      name: purchaseCompany.name,
      address: purchaseCompany.address,
      contactPersonName: purchaseCompany.contactPersonName,
      mobileNo: purchaseCompany.mobileNo,
      gstNo: purchaseCompany.gstNo,
      totalPurchase,
      totalPaid,
      pendingAmount: totalPurchase - totalPaid,
    };
  });

  const data = purchaseCompanies?.map((company, index) => {
    const bills =
      purchasedItems?.filter((bill) => bill.purchaseCompany === company._id) ||
      [];

    const totalPurchase = bills.reduce(
      (sum, bill) => sum + (bill?.finalAmount || 0),
      0,
    );

    const totalPaid = (company?.paidAmountHistory || []).reduce(
      (sum, payment) => sum + (payment?.amount || 0),
      0,
    );

    return {
      ...company,
      srNo: index + 1,
      totalPurchase,
      totalPaid,
      pendingAmount: totalPurchase - totalPaid,
    };
  });

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    { header: "Name", accessor: "name", filterType: "text" },
    {
      header: "Total Purchase",
      accessor: "totalPurchase",
      render: (val) => formatRupees(val),
    },
    {
      header: "Paid Amount",
      accessor: "totalPaid",
      render: (val) => formatRupees(val),
    },
    {
      header: "Pending",
      accessor: "pendingAmount",
      render: (val) => formatRupees(val),
    },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => {
            navigate(`/single-purchase-company/${row.name}`);
          },
          title: "View",
          type: "view",
        },
        {
          icon: FaWallet,
          onClick: (row) => {
            navigate(`/pay-to-purchase-company/${row.name}`);
          },
          title: "Pay",
          type: "payment",
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

  const exportFields = [
    { accessor: "name", header: "Name" },
    {
      accessor: "monthlyBills",
      header: "Total Purchases",
      render: (value, row) => {
        const items = Array.isArray(row.monthlyBills) ? row.monthlyBills : [];
        const totalBilling = items.reduce(
          (acc, bill) => acc + (bill?.totalAmount || 0),
          0,
        );
        return formatRupees(totalBilling);
      },
    },
    {
      accessor: "pendingAmount",
      header: "Pending Amount",
      render: (value) => formatRupees(value),
    },
  ];
  const totalPurchaseAmount = data?.reduce(
    (sum, item) => sum + (item.totalPurchase || 0),
    0,
  );

  const totalPaidAmount = data?.reduce(
    (sum, item) => sum + (item.totalPaid || 0),
    0,
  );

  const totalPendingAmount = data?.reduce(
    (sum, item) => sum + (item.pendingAmount || 0),
    0,
  );
  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Purchase Company Management</h2>

          <div className="summary-cards small">
            <div className="card total">
              <p className="title">Total Purchase</p>
              <h4 className="value">
                {formatRupees(totalPurchaseAmount || 0)}
              </h4>
            </div>

            <div className="card received">
              <p className="title">Total Paid</p>
              <h4 className="value">{formatRupees(totalPaidAmount || 0)}</h4>
            </div>

            <div className="card pending">
              <p className="title">Pending</p>
              <h4 className="value">{formatRupees(totalPendingAmount || 0)}</h4>
            </div>
          </div>

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
            selectedIds.includes(i + 1),
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
            ? "View Purchase Company"
            : modalType === "edit"
              ? "Edit Purchase Company"
              : modalType === "delete"
                ? "Delete Purchase Company"
                : "Add Purchase Company"
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
        {modalType === "view" && purchaseCompanyData ? (
          <div>
            <p>
              <strong>Name:</strong> {purchaseCompanyData.name}
            </p>
            <p>
              <strong>Address:</strong> {purchaseCompanyData.address}
            </p>
            <p>
              <strong>Contact Person Name:</strong>{" "}
              {purchaseCompanyData.contactPersonName}
            </p>
            <p>
              <strong>Mobile No:</strong> {purchaseCompanyData.mobileNo}
            </p>
            <p>
              <strong>GST No:</strong> {purchaseCompanyData.gstNo}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={purchaseCompanyData.name}
                onChange={handleChangePurchaseCompanyData}
                placeholder="Enter company name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                value={purchaseCompanyData.address}
                onChange={handleChangePurchaseCompanyData}
                placeholder="Enter address"
              />
            </div>
            <div className="input-group">
              <label htmlFor="contactPersonName">Contact Person Name</label>
              <input
                type="text"
                name="contactPersonName"
                value={purchaseCompanyData.contactPersonName}
                onChange={handleChangePurchaseCompanyData}
                placeholder="Enter contact person name"
              />
            </div>
            <div className="input-group">
              <label htmlFor="mobileNo">Mobile No</label>
              <input
                type="number"
                name="mobileNo"
                value={purchaseCompanyData.mobileNo}
                onChange={handleChangePurchaseCompanyData}
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
              <label htmlFor="gstNo">GST No</label>
              <input
                type="text"
                name="gstNo"
                value={purchaseCompanyData.gstNo}
                onChange={handleChangePurchaseCompanyData}
                placeholder="Enter GST number"
              />
            </div>
          </>
        ) : modalType === "delete" && purchaseCompanyData ? (
          <>
            <p>
              Are you sure you want to delete the purchase company "
              {purchaseCompanyData.name}"?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={purchaseCompanyData.password}
                onChange={handleChangePurchaseCompanyData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default PurchaseCompanies;
