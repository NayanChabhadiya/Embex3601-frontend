import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { useEffect, useState } from "react";
import {
  addMerchant,
  assignUniqueIdToMerchant,
  deleteMerchant,
  getMerchantsByUser,
  updateMerchant,
} from "../../../store/apiSlice/merchantSlice";
import {
  FaEdit,
  FaEye,
  FaIdBadge,
  FaPlus,
  FaTrash,
  FaWallet,
} from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { useNavigate } from "react-router-dom";
import { formatRupees } from "../../../utils/formatters";
import { getBillByUser } from "../../../store/apiSlice/billSlice";

const Merchant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getMerchantsByUser(loggedInUserId));
    dispatch(getBillByUser(loggedInUserId));
  }, [dispatch]);

  const { merchants } = useSelector((state) => state.merchants);
  const { bills } = useSelector((state) => state.bills);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [merchantData, setMerchantData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    uniqueId: "",
    name: "",
    mobileNo: "",
    address: "",
    gstNo: "",
  });

  const handleChangeMerchantData = (e) => {
    setMerchantData({
      ...merchantData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, merchant = null) => {
    setModalType(type);
    if (type === "view") {
      setMerchantData({
        loggedInUserId: loggedInUserId,
        _id: merchant._id,
        uniqueId: merchant.uniqueId,
        name: merchant.name,
        mobileNo: merchant.mobileNo,
        address: merchant.address,
        gstNo: merchant.gstNo,
      });
    } else if (type === "edit" || type === "add") {
      setMerchantData({
        loggedInUserId: loggedInUserId,
        _id: merchant ? merchant._id : "",
        uniqueId: merchant ? merchant.uniqueId : "",
        name: merchant ? merchant.name : "",
        mobileNo: merchant ? merchant.mobileNo : "",
        address: merchant ? merchant.address : "",
        gstNo: merchant ? merchant.gstNo : "",
      });
    } else if (type === "delete") {
      setMerchantData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: merchant._id,
        name: merchant.name,
        mobileNo: merchant.mobileNo,
        address: merchant.address,
        gstNo: merchant.gstNo,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setMerchantData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      uniqueId: "",
      name: "",
      mobileNo: "",
      address: "",
      gstNo: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!merchantData.name) {
        showToast("Merchant name is required", "error");
        return;
      } else if (!merchantData.address) {
        showToast("Address is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateMerchant(merchantData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Merchant updated successfully", "success");
            dispatch(getMerchantsByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update merchant", "error");
          }
        });
      }
    } else {
      if (!merchantData.name) {
        showToast("Merchant name is required", "error");
        return;
      } else if (!merchantData.address) {
        showToast("Address is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addMerchant(merchantData)).then((res) => {
          if (
            res.payload.message ===
            "Merchant with the same name and GST Number already exists."
          ) {
            dispatch(stopLoading());
            showToast(
              "Merchant with the same name and GST Number already exists.",
              "error",
            );
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Merchant added successfully", "success");
            dispatch(getMerchantsByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add merchant", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!merchantData.password) {
      showToast("Password is required to delete the merchant", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteMerchant(merchantData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Merchant deleted successfully", "success");
          dispatch(getMerchantsByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete merchant", "error");
        }
      });
    }
  };

  const assignMerchantUniqueId = (_id) => {
    dispatch(startLoading());
    dispatch(assignUniqueIdToMerchant({ loggedInUserId, _id }))
      .then((res) => {
        if (res.payload.success) {
          dispatch(getMerchantsByUser(loggedInUserId));
          dispatch(stopLoading());
          showToast("Unique ID assigned successfully", "success");
        } else {
          dispatch(stopLoading());
          showToast("Failed to assign unique ID", "error");
        }
      })
      .catch((err) => {
        dispatch(stopLoading());
        showToast("Something went wrong", "error");
      });
  };

  // const data = merchants?.map((merchant, index) => ({
  //   ...merchant,
  //   srNo: index + 1,
  //   _id: merchant._id,
  //   uniqueId: merchant.uniqueId,
  //   name: merchant.name,
  //   mobileNo: merchant.mobileNo,
  //   // address: merchant.address,
  //   // gstNo: merchant.gstNo,
  //   totalBillsAmount: bills?.filter((bill) => bill.merchantId === merchant._id)
  //     ? bills
  //         ?.filter((bill) => bill.merchantId === merchant._id)
  //         .reduce((acc, bill) => acc + (bill?.totalAmount || 0), 0)
  //     : 0,
  //   totalBillsCount: bills?.filter((bill) => bill.merchantId === merchant._id)
  //     ? bills?.filter((bill) => bill.merchantId === merchant._id).length
  //     : 0,
  //   // pendingAmount:

  //     // merchant?.monthlyJobWorks?.reduce(
  //     //   (acc, bill) => acc + (bill?.totalAmount || 0),
  //     //   0,
  //     // )
  //     //  -
  //     // merchant?.receivedAmountHistory?.reduce(
  //     //   (acc, payment) => acc + (payment?.amount || 0),
  //     //   0,
  //     // ),
  // }));

  const data = merchants?.map((merchant, index) => {
    const merchantBills =
      bills?.filter((bill) => bill.merchantId === merchant._id) || [];

    const totalBillsAmount = merchantBills.reduce(
      (acc, bill) => acc + (bill?.finalAmount || 0),
      0,
    );

    const totalReceivedAmount = merchantBills?.reduce((sum, bill) => {
      const payments = bill.paymentHistory || [];
      return sum + payments?.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
    }, 0);

    return {
      ...merchant,
      srNo: index + 1,
      _id: merchant._id,
      uniqueId: merchant.uniqueId,
      name: merchant.name,
      mobileNo: merchant.mobileNo,
      gstNo: merchant.gstNo,
      totalBillsAmount,
      totalBillsCount: merchantBills.length,

      pendingAmount: totalBillsAmount - totalReceivedAmount,
      receivedAmount: totalReceivedAmount,
    };
  });

  // console.log("mdata", data);

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    // { header: "Unique ID", accessor: "uniqueId", filterType: "text" },
    { header: "Name", accessor: "name", filterType: "text" },
    // { header: "Mobile No", accessor: "mobileNo", filterType: "text" },
    // { header: "Address", accessor: "address", filterType: "text" },
    { header: "GST No", accessor: "gstNo", filterType: "text" },
    {
      header: "Total Bills",
      accessor: "totalBillsCount",
      filterType: "text",
    },

    {
      header: "Total Bills Amount",
      accessor: "totalBillsAmount",
      filterType: "text",
      render: (value) => formatRupees(value),
    },
    {
      header: "Received Amount",
      accessor: "receivedAmount",
      filterType: "text",
      render: (value) => formatRupees(value),
    },
    {
      header: "Pending Amount",
      accessor: "pendingAmount",
      filterType: "text",
      render: (value) => formatRupees(value),
    },

    // {
    // header: "Total Purchases",
    // accessor: "monthlyJobWorks",
    // filterType: "text",
    // render: (value) => {
    //   const totalJobWorkBilling = value?.reduce(
    //     (acc, jobWork) => acc + (jobWork?.totalAmount || 0),
    //     0
    //   );
    //   return formatRupees(totalJobWorkBilling);
    // },
    // },
    // {
    //   header: "Total Paid Amount",
    //   accessor: "receivedAmountHistory",
    //   filterType: "text",
    //   render: (value) => {
    //     const totalReceivedAmount = value?.reduce(
    //       (acc, payment) => acc + (payment?.amount || 0),
    //       0
    //     );
    //     return formatRupees(totalReceivedAmount);
    //   },
    // },
    // {
    //   header: "Pending Amount",
    //   accessor: "pendingAmount",
    //   filterType: "text",
    //   render: (value) => formatRupees(value),
    // },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => {
            navigate(`/single-merchant/${row.name}`);
          },
          title: "View",
          type: "view",
        },
        // {
        //   icon: FaIdBadge,
        //   onClick: (row) => assignMerchantUniqueId(row._id),
        //   title: "ID Badge",
        //   type: "idBadge",
        // },
        // {
        //   icon: FaWallet,
        //   onClick: (row) => {
        //     navigate(`/merchant-received-amount/${row.name}`);
        //   },
        //   title: "Pay",
        //   type: "payment",
        // },
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
      accessor: "monthlyJobWorks",
      header: "Total Purchases",
      render: (value, row) => {
        const items = Array.isArray(row.monthlyJobWorks)
          ? row.monthlyJobWorks
          : [];
        const totalJobWorkBilling = items.reduce(
          (acc, jobWork) => acc + (jobWork?.totalAmount || 0),
          0,
        );
        return formatRupees(totalJobWorkBilling);
      },
    },
    {
      accessor: "receivedAmountHistory",
      header: "Total Paid Amount",
      render: (value, row) => {
        const items = Array.isArray(row.receivedAmountHistory)
          ? row.receivedAmountHistory
          : [];
        const totalReceivedAmount = items.reduce(
          (acc, payment) => acc + (payment?.amount || 0),
          0,
        );
        return formatRupees(totalReceivedAmount);
      },
    },
    {
      accessor: "pendingAmount",
      header: "Pending Amount",
      render: (value) => formatRupees(value),
    },
  ];

  const merchantTotalBillsAmount = data?.reduce(
    (sum, merchant) => sum + (merchant.totalBillsAmount || 0),
    0,
  );

  const totalReceivedAmount = data?.reduce(
    (sum, merchant) => sum + (merchant.receivedAmount || 0),
    0,
  );

  const totalPendingAmount = data?.reduce(
    (sum, merchant) => sum + (merchant.pendingAmount || 0),
    0,
  );

  const ledgerFields = [
    { accessor: "name", header: "Merchant Name" },

    {
      accessor: "totalBillsAmount",
      header: "Total Bill Amount",
      grandTotal: true,
      render: (val) => formatRupees(val),
    },
    {
      accessor: "receivedAmount",
      header: "Total Received",
      grandTotal: true,
      render: (val) => formatRupees(val),
    },
    {
      accessor: "pendingAmount",
      header: "Total Pending",
      grandTotal: true,
      render: (val) => formatRupees(val),
    },
  ];
  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Merchant Management</h2>
          <div className="summary-cards small">
            <div className="card total">
              <p className="title">Total</p>
              <h4 className="value">
                {formatRupees(merchantTotalBillsAmount || 0)}
              </h4>
            </div>
            <div className="card received">
              <p className="title">Received</p>
              <h4 className="value">
                {formatRupees(totalReceivedAmount || 0)}
              </h4>
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
        ledgerFields={ledgerFields}
        onSelectionChange={(selectedIds) => {
          const selected = data.filter((row) => selectedIds.includes(row.srNo));
          setSelectedData(selected);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Merchant"
            : modalType === "edit"
              ? "Edit Merchant"
              : modalType === "delete"
                ? "Delete Merchant"
                : "Add Merchant"
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
        {modalType === "view" && merchantData ? (
          <div>
            <p>
              <strong>Name:</strong> {merchantData.name}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="row">
              <div className={modalType === "add" ? "col-12" : "col-8"}>
                <div className="input-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={merchantData.name}
                    onChange={handleChangeMerchantData}
                    placeholder="Enter merchnat name"
                  />
                </div>
              </div>
              {modalType === "edit" && (
                <div className="col-4">
                  <div className="input-group">
                    <label htmlFor="uniqueId">Unique ID</label>
                    <input
                      type="text"
                      name="uniqueId"
                      value={merchantData.uniqueId}
                      onChange={handleChangeMerchantData}
                      placeholder="Enter unique ID"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="address">address</label>
              <textarea
                name="address"
                value={merchantData.address}
                onChange={handleChangeMerchantData}
                placeholder="Enter item address"
              ></textarea>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Mobile No</label>
                  <input
                    type="number"
                    name="mobileNo"
                    value={merchantData.mobileNo}
                    onChange={handleChangeMerchantData}
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
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label>GST No</label>
                  <input
                    type="text"
                    name="gstNo"
                    value={merchantData.gstNo}
                    onChange={handleChangeMerchantData}
                    placeholder="Enter GST number"
                  />
                </div>
              </div>
            </div>
          </>
        ) : modalType === "delete" && merchantData ? (
          <>
            <p>
              Are you sure you want to delete the merchant "{merchantData.name}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={merchantData.password}
                onChange={handleChangeMerchantData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Merchant;
