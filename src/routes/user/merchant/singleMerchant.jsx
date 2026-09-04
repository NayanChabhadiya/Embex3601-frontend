import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addReceivedPayment,
  deleteReceivedPayment,
  getMerchantsByUser,
  updateReceivedPayment,
} from "../../../store/apiSlice/merchantSlice";

import { FaEdit, FaHome, FaTrash, FaWallet } from "react-icons/fa";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  formatDate,
  formatDateForInput,
  formatRupees,
} from "../../../utils/formatters";
import { render } from "react-dom";
import { getBillByUser } from "../../../store/apiSlice/billSlice";

const SingleMerchant = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    // dispatch(getMerchantsByUser(loggedInUserId));
    if (loggedInUserId) {
      dispatch(getMerchantsByUser(loggedInUserId));
      dispatch(getBillByUser(loggedInUserId));
    }
  }, [dispatch]);

  // 🔄 Keep selectedData always updated when Redux bills change

  const { merchants } = useSelector((state) => state.merchants);
  const merchant = merchants?.find((merchant) => merchant.name === name);

  const { bills } = useSelector((state) => state.bills);
  const merchantBills = bills?.filter(
    (bill) => bill.merchantId === merchant?._id,
  );

  const { companies } = useSelector((state) => state.companies);

  const merchantTotalBillsAmount = merchantBills?.reduce(
    (total, bill) => total + parseFloat(bill.finalAmount || 0),
    0,
  );

  const totalReceivedAmount = merchantBills?.reduce((sum, bill) => {
    const payments = bill.paymentHistory || [];
    return sum + payments?.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  }, 0);

  const totalPendingAmount = Math.max(
    0,
    merchantTotalBillsAmount - totalReceivedAmount,
  );

  useEffect(() => {
    if (selectedData?._id) {
      const updatedBill = bills.find((b) => b._id === selectedData._id);
      if (updatedBill) {
        setSelectedData(updatedBill);
      }
    }
  }, [bills]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [merchantBillReceivedData, setMerchantBillReceivedData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    merchantId: merchant?._id,
    billId: "",
    _id: "",
    amount: "",
    date: "",
    remarks: "",
  });

  const handleChangeData = (e) => {
    setMerchantBillReceivedData({
      ...merchantBillReceivedData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, bill = null) => {
    setModalType(type);
    setSelectedData(bill);

    if (type === "edit" || type === "add") {
      setMerchantBillReceivedData({
        loggedInUserId: loggedInUserId,
        merchantId: merchant?._id,
        _id: bill?._id || "",
        billId: selectedData?._id || bill?._id || "",
        amount: bill?.amount
          ? parseFloat(bill.amount).toFixed(2)
          : parseFloat(0).toFixed(2),
        date: bill?.date || "",
        remarks: bill?.remarks || "",
      });
    } else if (type === "delete") {
      setMerchantBillReceivedData({
        loggedInUserId: loggedInUserId,
        merchantId: merchant?._id,
        billId: selectedData?._id || "",
        _id: bill?._id || "",
        password: "",
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setMerchantBillReceivedData({
      loggedInUserId: loggedInUserId,
      merchantId: merchant?._id,
      password: "",
      _id: "",
      billId: "",
      amount: "",
      date: "",
      remarks: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!merchantBillReceivedData.amount) {
        showToast("Please enter amount", "error");
        return;
      } else if (!merchantBillReceivedData.date) {
        showToast("Please select date", "error");
        return;
      }
      dispatch(startLoading());
      dispatch(updateReceivedPayment(merchantBillReceivedData)).then((res) => {
        if (res?.payload?.success) {
          dispatch(stopLoading());
          showToast("Received payment updated successfully", "success");
          closeModal();
          dispatch(getMerchantsByUser(loggedInUserId));
          dispatch(getBillByUser(loggedInUserId));
        } else {
          dispatch(stopLoading());
          showToast("Failed to update received payment", "error");
        }
      });
    } else {
      if (!merchantBillReceivedData.amount) {
        showToast("Please enter amount", "error");
        return;
      } else if (!merchantBillReceivedData.date) {
        showToast("Please select date", "error");
        return;
      } else if (!merchantBillReceivedData.remarks) {
        showToast("Please enter remarks", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addReceivedPayment(merchantBillReceivedData)).then((res) => {
          if (res?.payload?.success) {
            dispatch(stopLoading());
            showToast("Received payment added successfully", "success");
            closeModal();
            dispatch(getMerchantsByUser(loggedInUserId));
            dispatch(getBillByUser(loggedInUserId));
          } else {
            dispatch(stopLoading());
            showToast("Failed to add received payment", "error");
          }
        });
      }
    }
  };

  const handleDelete = async () => {
    if (modalType === "delete") {
      if (!merchantBillReceivedData.password) {
        showToast("Please enter your password", "error");
        return;
      }

      dispatch(startLoading());
      const res = await dispatch(
        deleteReceivedPayment(merchantBillReceivedData),
      );
      dispatch(stopLoading());

      if (res?.payload?.success) {
        showToast("Received payment deleted successfully", "success");

        setSelectedData((prev) => {
          if (!prev) return null;
          const updatedPaymentHistory = prev.paymentHistory?.filter(
            (p) => p._id !== merchantBillReceivedData._id,
          );
          return { ...prev, paymentHistory: updatedPaymentHistory };
        });

        closeModal();

        await Promise.all([
          dispatch(getMerchantsByUser(loggedInUserId)),
          dispatch(getBillByUser(loggedInUserId)),
        ]);
      } else {
        showToast("Failed to delete received payment", "error");
      }
    }
  };

  const data = merchantBills?.map((bill, index) => ({
    ...bill,
    srNo: index + 1,
    billNo: bill.billNo,
    companyName:
      companies?.find((c) => c._id === bill.companyId)?.name || "N/A",
    billDate: bill.billDate,
    subTotal: bill.subTotal,
    finalAmount: bill.finalAmount,
    receivedAmount: bill?.paymentHistory
      ? bill.paymentHistory.reduce(
          (sum, p) => sum + parseFloat(p.amount || 0),
          0,
        )
      : 0,
    pendingAmount:
      bill.finalAmount -
      bill.paymentHistory.reduce(
        (sum, p) => sum + parseFloat(p.amount || 0),
        0,
      ),
    actions: bill,
  }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    { header: "Bill No", accessor: "billNo", filterType: "text" },
    { header: "Company Name", accessor: "companyName", filterType: "text" },
    {
      header: "Bill Date",
      accessor: "billDate",
      filterType: "date",
      render: (value) => formatDate(value),
      filterType: "date-range",
      size: "md",
    },
    {
      header: "Taxable Amount",
      accessor: "subTotal",
      filterType: "text",
      render: (value) => formatRupees(value),
    },
    {
      header: "Total Amount",
      accessor: "finalAmount",
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
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaHome,
          onClick: (row) => {
            navigate(`/merchants`);
          },
          title: "Home",
          type: "edit",
        },
        {
          icon: FaWallet,
          onClick: (row) => openModal("add", row),
          title: "Pay",
          type: "payment",
        },
      ],
    },
  ];

  const paymentHistoryData = selectedData?.paymentHistory?.map(
    (payment, index) => ({
      ...payment,
      srNo: index + 1,
    }),
  );

  const paymentHistoryColumns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    {
      header: "Date",
      accessor: "date",
      filterType: "date",
      render: (value) => formatDate(value),
    },
    {
      header: "Amount",
      accessor: "amount",
      filterType: "text",
      render: (value) => formatRupees(value),
    },
    { header: "Remarks", accessor: "remarks", filterType: "text" },
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
  const ledgerFields = [
    { accessor: "billNo", header: "Bill No" },
    {
      accessor: "billDate",
      header: "Bill Date",
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },

    {
      accessor: "finalAmount",
      header: "Bill Amount",
      grandTotal: true,
      render: (val) => `₹${parseFloat(val || 0).toLocaleString("en-IN")}`,
    },
    {
      accessor: "receivedAmount",
      header: "Received Amount",
      grandTotal: true,
      render: (val) => `₹${parseFloat(val || 0).toLocaleString("en-IN")}`,
    },
    {
      accessor: "pendingAmount",
      header: "Pending Amount",
      grandTotal: true,
      render: (val) => `₹${parseFloat(val || 0).toLocaleString("en-IN")}`,
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">{name}'s Bills</h2>
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
        ledgerFields={ledgerFields}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "edit"
            ? "Edit Received Payment"
            : modalType === "delete"
              ? "Delete Received Payment"
              : "Add Received Payment"
        }
        footer={
          <>
            {modalType === "delete" ? (
              <button className="btn-danger" onClick={handleDelete}>
                Delete
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSave}>
                {modalType === "edit" ? "Update" : "Add"}
              </button>
            )}
          </>
        }
      >
        {modalType === "edit" || modalType === "add" ? (
          <>
            {selectedData?.paymentHistory?.length > 0 ? (
              <DataTable
                columns={paymentHistoryColumns}
                data={paymentHistoryData}
                showSelection={false}
                showClearFilters={false}
                showFilters={false}
                showExportCSV={false}
                showSearch={false}
                showLedgerPDF={false}
              />
            ) : (
              <p>No payment history available.</p>
            )}
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={merchantBillReceivedData.amount}
                    onChange={handleChangeData}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formatDateForInput(merchantBillReceivedData.date)}
                    onChange={handleChangeData}
                    placeholder="Select date"
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={merchantBillReceivedData.remarks}
                onChange={handleChangeData}
                placeholder="Enter remarks"
              ></textarea>
            </div>
          </>
        ) : modalType === "delete" && merchantBillReceivedData ? (
          <>
            <p>Are you sure you want to delete this received payment ?</p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={merchantBillReceivedData.password}
                onChange={handleChangeData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default SingleMerchant;
