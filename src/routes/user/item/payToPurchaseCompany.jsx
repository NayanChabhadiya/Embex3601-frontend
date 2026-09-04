import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addPaidAmount,
  deletePaidAmount,
  getPurchaseCompanyByUser,
  updatePaidAmount,
} from "../../../store/apiSlice/purchaseCompanySlice";
import { FaEdit, FaHome, FaPlus, FaTrash } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { formatRupees } from "../../../utils/formatters";
import { render } from "react-dom";

const getFormattedDate = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-CA");
};

const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatDateToDDMMYYYY = (inputDate) => {
  if (!inputDate) return "";
  const date = new Date(inputDate);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const PayToPurchaseCompany = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getPurchaseCompanyByUser(loggedInUserId));
  }, [dispatch]);

  const { purchaseCompanies } = useSelector((state) => state.purchaseCompanies);
  const company = purchaseCompanies?.find((company) => company.name === name);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const today = new Date();
  const formattedToday = getFormattedDate(today);
  const [paidAmountHistoryData, setPaidAmountHistoryData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    purchaseCompanyId: company?._id,
    _id: "",
    billDate: formattedToday,
    amount: parseFloat(0).toFixed(2),
    remarks: "",
  });

  const handleChangeData = (e) => {
    setPaidAmountHistoryData({
      ...paidAmountHistoryData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, paidAmountHistory = null) => {
    setModalType(type);
    if (type === "edit" || type === "add") {
      setPaidAmountHistoryData({
        loggedInUserId: loggedInUserId,
        purchaseCompanyId: company?._id,
        _id: paidAmountHistory ? paidAmountHistory._id : "",
        date: paidAmountHistory
          ? formatDateForInput(paidAmountHistory.date)
          : formattedToday,
        amount: paidAmountHistory
          ? parseFloat(paidAmountHistory.amount).toFixed(2)
          : parseFloat(0).toFixed(2),
        remarks: paidAmountHistory ? paidAmountHistory.remarks : "",
      });
    } else if (type === "delete") {
      setPaidAmountHistoryData({
        loggedInUserId: loggedInUserId,
        purchaseCompanyId: company?._id,
        _id: paidAmountHistory ? paidAmountHistory._id : "",
        date: paidAmountHistory
          ? formatDateForInput(paidAmountHistory.date)
          : formattedToday,
        amount: paidAmountHistory
          ? parseFloat(paidAmountHistory.amount).toFixed(2)
          : parseFloat(0).toFixed(2),
        remarks: paidAmountHistory ? paidAmountHistory.remarks : "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setPaidAmountHistoryData({
      loggedInUserId: loggedInUserId,
      purchaseCompanyId: company?._id,
      password: "",
      _id: "",
      date: formattedToday,
      amount: parseFloat(0).toFixed(2),
      remarks: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!paidAmountHistoryData.date) {
        showToast("Please select date", "error");
        return;
      } else if (
        !paidAmountHistoryData.amount ||
        paidAmountHistoryData.amount === 0
      ) {
        showToast("Please enter amount", "error");
        return;
      } else if (!paidAmountHistoryData.remarks) {
        showToast("Please enter remarks", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updatePaidAmount(paidAmountHistoryData)).then((res) => {
          if (res?.payload?.success) {
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
            dispatch(stopLoading());
            showToast("Payment history updated successfully", "success");
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update payment history", "error");
          }
        });
      }
    } else {
      if (!paidAmountHistoryData.date) {
        showToast("Please select date", "error");
        return;
      } else if (
        !paidAmountHistoryData.amount ||
        paidAmountHistoryData.amount === 0
      ) {
        showToast("Please enter amount", "error");
        return;
      } else if (!paidAmountHistoryData.remarks) {
        showToast("Please enter remarks", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addPaidAmount(paidAmountHistoryData)).then((res) => {
          if (res?.payload?.success) {
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
            dispatch(stopLoading());
            showToast("Payment history added successfully", "success");
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add payment history", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (modalType === "delete") {
      if (!paidAmountHistoryData.password) {
        showToast("Please enter your password", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(deletePaidAmount(paidAmountHistoryData)).then((res) => {
          if (res?.payload?.message === "Incorrect password!") {
            dispatch(stopLoading());
            showToast("Incorrect password!", "error");
          } else if (res?.payload?.success) {
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
            dispatch(stopLoading());
            showToast("Payment history deleted successfully", "success");
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to delete payment history", "error");
          }
        });
      }
    }
  };

  const data = company?.paidAmountHistory?.map((paidAmountHistory, index) => ({
    ...paidAmountHistory,
    _id: paidAmountHistory._id,
    srNo: index + 1,
    date: paidAmountHistory.date,
    amount: parseFloat(paidAmountHistory.amount).toFixed(2),
    remarks: paidAmountHistory.remarks,
  }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    {
      header: "Date",
      accessor: "date",
      render: (value) => formatDateToDDMMYYYY(value),
      filterType: "date-range",
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
          icon: FaHome,
          onClick: (row) => {
            navigate(`/single-purchase-company/${company.name}`);
          },
          title: "Home",
          type: "edit",
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
          <h2 className="page-title">{name} PAYMENT HISTORY</h2>
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
          modalType === "edit"
            ? "Edit Payment History"
            : modalType === "delete"
            ? "Delete Payment History"
            : "Add Payment History"
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
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="date">date</label>
                  <input
                    type="date"
                    name="date"
                    value={paidAmountHistoryData.date}
                    onChange={handleChangeData}
                    placeholder="Select date"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={paidAmountHistoryData.amount}
                    onChange={handleChangeData}
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "." ||
                        e.key === "+"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                name="remarks"
                value={paidAmountHistoryData.remarks}
                onChange={handleChangeData}
                placeholder="Enter remarks"
              ></textarea>
            </div>
          </>
        ) : modalType === "delete" && paidAmountHistoryData ? (
          <>
            <p>
              Are you sure you want to delete this payment history entry for{" "}
              {formatDateToDDMMYYYY(paidAmountHistoryData.date)} with amount{" "}
              {formatRupees(paidAmountHistoryData.amount)}?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={paidAmountHistoryData.password}
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

export default PayToPurchaseCompany;
