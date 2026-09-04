import { useEffect, useState } from "react";
import { FaEdit, FaHome, FaPlus, FaTrash, FaWallet } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addMonthlyBill,
  deleteMonthlyBill,
  getPurchaseCompanyByUser,
  updateMonthlyBill,
} from "../../../store/apiSlice/purchaseCompanySlice";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import { formatDate, formatRupees } from "../../../utils/formatters";

const SinglePurchaseCompany = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getPurchaseCompanyByUser(loggedInUserId));
  }, [dispatch]);

  const { purchaseCompanies } = useSelector((state) => state.purchaseCompanies);
  const { purchasedItems } = useSelector((state) => state.purchasedItems);
  const company = purchaseCompanies?.find((company) => company.name === name);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const currentYear = new Date().getFullYear();
  const [monthlyBillData, setMonthlyBillData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    purchaseCompanyId: company?._id,
    _id: "",
    month: currentMonth,
    year: currentYear,
    totalAmount: parseFloat(0).toFixed(2),
  });

  const handleChangeData = (e) => {
    setMonthlyBillData({
      ...monthlyBillData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, monthlyBill = null) => {
    setModalType(type);
    if (type === "edit" || type === "add") {
      setMonthlyBillData({
        loggedInUserId: loggedInUserId,
        purchaseCompanyId: company?._id,
        _id: monthlyBill ? monthlyBill._id : "",
        month: monthlyBill ? monthlyBill.month : currentMonth,
        year: monthlyBill ? monthlyBill.year : currentYear,
        totalAmount: monthlyBill
          ? parseFloat(monthlyBill.totalAmount).toFixed(2)
          : parseFloat(0).toFixed(2),
      });
    } else if (type === "delete") {
      setMonthlyBillData({
        loggedInUserId: loggedInUserId,
        purchaseCompanyId: company?._id,
        _id: monthlyBill ? monthlyBill._id : "",
        month: monthlyBill ? monthlyBill.month : currentMonth,
        year: monthlyBill ? monthlyBill.year : currentYear,
        totalAmount: monthlyBill
          ? parseFloat(monthlyBill.totalAmount).toFixed(2)
          : parseFloat(0).toFixed(2),
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setMonthlyBillData({
      loggedInUserId: loggedInUserId,
      purchaseCompanyId: company?._id,
      password: "",
      _id: "",
      month: currentMonth,
      year: currentYear,
      totalAmount: parseFloat(0).toFixed(2),
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!monthlyBillData.month) {
        showToast("Please select month", "error");
        return;
      } else if (!monthlyBillData.year) {
        showToast("Please select year", "error");
        return;
      } else if (
        !monthlyBillData.totalAmount ||
        monthlyBillData.totalAmount <= 0
      ) {
        showToast("Please enter total amount", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateMonthlyBill(monthlyBillData)).then((res) => {
          if (res?.payload?.success) {
            dispatch(stopLoading());
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
            showToast("Monthly bill updated successfully", "success");
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update monthly bill", "error");
          }
        });
      }
    } else {
      if (!monthlyBillData.month) {
        showToast("Please select month", "error");
        return;
      } else if (!monthlyBillData.year) {
        showToast("Please select year", "error");
        return;
      } else if (
        !monthlyBillData.totalAmount ||
        monthlyBillData.totalAmount <= 0
      ) {
        showToast("Please enter total amount", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addMonthlyBill(monthlyBillData)).then((res) => {
          if (
            res?.payload?.message ===
            "Monthly bill for this month already exists"
          ) {
            dispatch(stopLoading());
            showToast("Monthly bill for this month already exists", "error");
            return;
          } else if (res?.payload?.success) {
            dispatch(stopLoading());
            showToast("Monthly bill added successfully", "success");
            closeModal();
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
          } else {
            dispatch(stopLoading());
            showToast("Failed to add monthly bill", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (modalType === "delete") {
      if (!monthlyBillData.password) {
        showToast("Please enter your password", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(deleteMonthlyBill(monthlyBillData)).then((res) => {
          if (res?.payload?.message === "Incorrect password!") {
            dispatch(stopLoading());
            showToast("Incorrect password!", "error");
            return;
          } else if (res?.payload?.success) {
            dispatch(stopLoading());
            showToast("Monthly bill deleted successfully", "success");
            closeModal();
            dispatch(getPurchaseCompanyByUser(loggedInUserId));
          } else {
            dispatch(stopLoading());
            showToast("Failed to delete monthly bill", "error");
          }
        });
      }
    }
  };
  // ================= BILLS =================
  const companyBills =
    purchasedItems?.filter((bill) => bill.purchaseCompany === company?._id) ||
    [];

  const totalPurchase = companyBills?.reduce(
    (sum, bill) => sum + (bill?.finalAmount || 0),
    0,
  );

  const totalPaid = (company?.paidAmountHistory || []).reduce(
    (sum, p) => sum + (p.amount || 0),
    0,
  );

  const totalPending = totalPurchase - totalPaid;
  const extractChallanNumber = (challanNo) => {
    if (!challanNo) return 0;
    const match = challanNo.match(/(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  };
  const data = companyBills
    ?.slice()
    ?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // 🔥 1. Sort by Date (latest first)
      if (dateB - dateA !== 0) return dateB - dateA;

      // 🔥 2. If same date → sort by Challan No
      const numA = extractChallanNumber(a.purchaseCompanyChallanNo);
      const numB = extractChallanNumber(b.purchaseCompanyChallanNo);

      return numB - numA;
    })
    ?.map((bill, index) => ({
      ...bill,
      _id: bill._id,
      srNo: index + 1,
      date: bill.date,
      challaNo: bill.purchaseCompanyChallanNo,
      totalAmount: bill.finalAmount,
    }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    { header: "Ch. No", accessor: "challaNo", filterType: "text" },
    {
      header: "Date",
      accessor: "date",
      filterType: "date-range",
      size: "md",
      render: (value) => formatDate(value),
    },
    {
      header: "Total Amount",
      accessor: "totalAmount",
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
            navigate(`/purchase-companies`);
          },
          title: "Home",
          type: "edit",
        },
        {
          icon: FaWallet,
          onClick: (row) => {
            navigate(`/pay-to-purchase-company/${company.name}`);
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

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">{name} Ledger</h2>
          <div className="summary-cards small">
            <div className="card total">
              <p className="title">Total</p>
              <h4 className="value">{formatRupees(totalPurchase || 0)}</h4>
            </div>
            <div className="card received">
              <p className="title">Received</p>
              <h4 className="value">{formatRupees(totalPaid || 0)}</h4>
            </div>
            <div className="card pending">
              <p className="title">Pending</p>
              <h4 className="value">{formatRupees(totalPending || 0)}</h4>
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
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "edit"
            ? "Edit Monthly Bill"
            : modalType === "delete"
              ? "Delete Monthly Bill"
              : "Add Monthly Bill"
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
                  <label htmlFor="month">Month</label>
                  <select
                    name="month"
                    value={monthlyBillData.month}
                    onChange={handleChangeData}
                  >
                    {[
                      "JANUARY",
                      "FEBRUARY",
                      "MARCH",
                      "APRIL",
                      "MAY",
                      "JUNE",
                      "JULY",
                      "AUGUST",
                      "SEPTEMBER",
                      "OCTOBER",
                      "NOVEMBER",
                      "DECEMBER",
                    ]?.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="year">Year</label>
                  <select
                    name="year"
                    value={monthlyBillData.year}
                    onChange={handleChangeData}
                  >
                    {[currentYear, currentYear - 1, currentYear - 2]?.map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="totalAmount">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={monthlyBillData.totalAmount}
                onChange={handleChangeData}
                onKeyDown={(e) => {
                  if (
                    e.keyCode === 38 ||
                    e.keyCode === 40 ||
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "-" ||
                    e.key === "." ||
                    e.key === "+"
                  ) {
                    e.preventDefault();
                  }
                }}
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>
          </>
        ) : modalType === "delete" && monthlyBillData ? (
          <>
            <p>
              Are you sure you want to delete this monthly bill for{" "}
              <strong>
                {monthlyBillData.month} - {monthlyBillData.year}
              </strong>
              ?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={monthlyBillData.password}
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

export default SinglePurchaseCompany;
