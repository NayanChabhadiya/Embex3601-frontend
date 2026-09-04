import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addWorkerAdvance,
  addWorkerLeave,
  deleteWorkerAdvance,
  deleteWorkerLeave,
  getWorkerByUser,
  updateWorkerAdvance,
  updateWorkerLeave,
} from "../../../store/apiSlice/workerSlice";
import { FaEdit, FaEye, FaHome, FaPlus, FaTrash } from "react-icons/fa";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import {
  formatDate,
  formatDateForInput,
  formatRupees,
} from "../../../utils/formatters";
import DataTable from "../../../components/datatable/dataTable";

const SingleWorker = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getWorkerByUser(loggedInUserId));
  }, [dispatch]);

  const { workers } = useSelector((state) => state.workers);
  const worker = workers?.find((worker) => worker.name === name);

  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const currentDate = new Date().toISOString().split("T")[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [workerAvanceData, setWorkerAdvanceData] = useState({
    loggedInUserId: loggedInUserId,
    _id: worker ? worker._id : "",
    password: "",
    date: currentDate,
    amount: "",
    remarks: "",
    advanceId: "",
  });

  const [workerLeaveData, setWorkerLeaveData] = useState({
    loggedInUserId: loggedInUserId,
    _id: worker ? worker._id : "",
    password: "",
    date: currentDate,
    remarks: "",
    leaveId: "",
  });

  const handleChangeWorkerAdvanceData = (e) => {
    setWorkerAdvanceData({
      ...workerAvanceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeWorkerLeaveData = (e) => {
    setWorkerLeaveData({
      ...workerLeaveData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, workerData = null) => {
    setModalType(type);

    if (type === "viewAdvance" && workerData) {
      setWorkerAdvanceData({
        ...workerAvanceData,
        loggedInUserId,
        _id: workerData._id,
        date: workerData.date,
        amount: workerData.amount,
        remarks: workerData.remarks,
      });
    } else if (type === "editAdvance" && workerData) {
      setWorkerAdvanceData({
        ...workerAvanceData,
        loggedInUserId,
        _id: worker?._id,
        date: workerData.date,
        amount: workerData.amount,
        remarks: workerData.remarks,
        advanceId: workerData._id || "",
      });
    } else if (type === "addAdvance") {
      setWorkerAdvanceData({
        ...workerAvanceData,
        loggedInUserId,
        _id: worker?._id || "",
        date: currentDate,
        amount: "",
        remarks: "",
      });
    } else if (type === "deleteAdvance" && workerData) {
      setWorkerAdvanceData({
        ...workerAvanceData,
        loggedInUserId,
        _id: worker._id,
        password: "",
        advanceId: workerData._id || "",
      });
    } else if (type === "viewLeave" && workerData) {
      setWorkerLeaveData({
        ...workerLeaveData,
        loggedInUserId,
        _id: workerData._id,
        date: workerData.date,
        remarks: workerData.remarks,
      });
    } else if (type === "editLeave" && workerData) {
      setWorkerLeaveData({
        ...workerLeaveData,
        loggedInUserId,
        _id: worker?._id,
        date: workerData.date,
        remarks: workerData.remarks,
        leaveId: workerData._id || "",
      });
    } else if (type === "addLeave") {
      setWorkerLeaveData({
        ...workerLeaveData,
        loggedInUserId,
        _id: worker?._id || "",
        date: currentDate,
        remarks: "",
      });
    } else if (type === "deleteLeave" && workerData) {
      setWorkerLeaveData({
        ...workerLeaveData,
        loggedInUserId,
        _id: worker._id,
        password: "",
        leaveId: workerData._id || "",
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setWorkerAdvanceData({
      loggedInUserId,
      password: "",
      _id: worker ? worker._id : "",
      date: currentDate,
      amount: "",
      remarks: "",
    });
    setWorkerLeaveData({
      loggedInUserId,
      password: "",
      _id: worker ? worker._id : "",
      date: currentDate,
      remarks: "",
      leaveId: "",
    });
  };

  const handleSave = () => {
    if (modalType === "editAdvance") {
      if (!workerAvanceData.date) {
        showToast("Worker name is required", "error");
        return;
      } else if (!workerAvanceData.amount) {
        showToast("Amount is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateWorkerAdvance(workerAvanceData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Worker advance updated successfully", "success");
            dispatch(getWorkerByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update worker advance", "error");
          }
        });
      }
    } else if (modalType === "addAdvance") {
      if (!workerAvanceData.date) {
        showToast("Date is required", "error");
        return;
      } else if (!workerAvanceData.amount) {
        showToast("Amount is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addWorkerAdvance(workerAvanceData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Worker advance added successfully", "success");
            dispatch(getWorkerByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add worker advance", "error");
          }
        });
      }
    } else if (modalType === "editLeave") {
      if (!workerLeaveData.date) {
        showToast("Date is required", "error");
        return;
      } else if (!workerLeaveData.remarks) {
        showToast("Remarks is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateWorkerLeave(workerLeaveData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Worker leave updated successfully", "success");
            dispatch(getWorkerByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update worker leave", "error");
          }
        });
      }
    } else if (modalType === "addLeave") {
      if (!workerLeaveData.date) {
        showToast("Date is required", "error");
        return;
      } else if (!workerLeaveData.remarks) {
        showToast("Remarks is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addWorkerLeave(workerLeaveData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Worker leave added successfully", "success");
            dispatch(getWorkerByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add worker leave", "error");
          }
        });
      }
    }
  };

  const handleDeleteAdvance = () => {
    if (!workerAvanceData.password) {
      showToast("Password is required to delete the worker advance", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteWorkerAdvance(workerAvanceData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Worker advance deleted successfully", "success");
          dispatch(getWorkerByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete worker advance", "error");
        }
      });
    }
  };

  const handleDeleteLeave = () => {
    if (!workerLeaveData.password) {
      showToast("Password is required to delete the worker leave", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteWorkerLeave(workerLeaveData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Worker leave deleted successfully", "success");
          dispatch(getWorkerByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete worker leave", "error");
        }
      });
    }
  };

  const advanceData = worker?.advanceHistory?.map((advanceData, index) => ({
    ...advanceData,
    srNo: index + 1,
    _id: advanceData._id,
    date: advanceData.date,
    amount: advanceData.amount,
    remarks: advanceData.remarks,
  }));

  const leaveData = worker?.leaveHistory?.map((leaveData, index) => ({
    ...leaveData,
    srNo: index + 1,
    _id: leaveData._id,
    date: leaveData.date,
    remarks: leaveData.remarks,
  }));

  const [selectedAdvanceMonth, setSelectedAdvanceMonth] =
    useState(currentMonth);

  const filteredAdvanceData = advanceData?.filter((item) => {
    const itemMonth = new Date(item.date)
      .toLocaleString("default", { month: "long" })
      .toUpperCase();
    if (!selectedAdvanceMonth) return true;

    return itemMonth === selectedAdvanceMonth;
  });

  const [selectedLeaveMonth, setSelectedLeaveMonth] = useState(currentMonth);

  const filteredLeaveData = leaveData?.filter((item) => {
    const itemMonth = new Date(item.date)
      .toLocaleString("default", { month: "long" })
      .toUpperCase();
    if (!selectedLeaveMonth) return true;
    return itemMonth === selectedLeaveMonth;
  });

  const advancecolumns = [
    { header: "Sr No", accessor: "srNo" },
    {
      header: "Date",
      accessor: "date",
      render: (value) => formatDate(value),
    },
    { header: "Amount", accessor: "amount" },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => openModal("viewAdvance", row),
          title: "View",
          type: "view",
        },
        ,
        {
          icon: FaEdit,
          onClick: (row) => openModal("editAdvance", row),
          title: "Edit",
          type: "edit",
        },
        {
          icon: FaTrash,
          onClick: (row) => openModal("deleteAdvance", row),
          title: "Delete",
          type: "delete",
        },
      ],
    },
  ];

  const leaveColumns = [
    { header: "Sr No", accessor: "srNo" },
    {
      header: "Date",
      accessor: "date",
      render: (value) => formatDate(value),
    },
    { header: "Remarks", accessor: "remarks" },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => openModal("viewLeave", row),
          title: "View",
          type: "view",
        },
        {
          icon: FaEdit,
          onClick: (row) => openModal("editLeave", row),
          title: "Edit",
          type: "edit",
        },
        {
          icon: FaTrash,
          onClick: (row) => openModal("deleteLeave", row),
          title: "Delete",
          type: "delete",
        },
      ],
    },
  ];

  return (
    <>
      <div className="single-data-page">
        <div className="page-header">
          <div className="header-actions">
            <h2 className="page-title">
              Data for Worker: {worker?.name || "N/A"}
            </h2>
            <button className="btn-add" onClick={() => navigate("/workers")}>
              <FaHome /> Home
            </button>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="left-section">
            <div className="section-header">
              <h2 className="section-title">Advance History</h2>
              <select
                value={selectedAdvanceMonth}
                onChange={(e) => setSelectedAdvanceMonth(e.target.value)}
                className="month-select"
              >
                <option value="">All Months</option>
                <option value="JANUARY">JANUARY</option>
                <option value="FEBRUARY">FEBRUARY</option>
                <option value="MARCH">MARCH</option>
                <option value="APRIL">APRIL</option>
                <option value="MAY">MAY</option>
                <option value="JUNE">JUNE</option>
                <option value="JULY">JULY</option>
                <option value="AUGUST">AUGUST</option>
                <option value="SEPTEMBER">SEPTEMBER</option>
                <option value="OCTOBER">OCTOBER</option>
                <option value="NOVEMBER">NOVEMBER</option>
                <option value="DECEMBER">DECEMBER</option>
              </select>
              <button
                className="btn-add"
                onClick={() => openModal("addAdvance")}
              >
                <FaPlus />
              </button>
            </div>
            <DataTable
              columns={advancecolumns}
              data={filteredAdvanceData}
              showClearFilters={false}
              showExportCSV={false}
              showLedgerPDF={false}
              showSelection={false}
              showSearch={false}
              showFilters={false}
            />
          </div>

          <div className="right-section">
            <div className="section-header">
              <h2 className="section-title">Leave History</h2>
              <select
                value={selectedLeaveMonth}
                onChange={(e) => setSelectedLeaveMonth(e.target.value)}
                className="month-select"
              >
                <option value="">All Months</option>
                <option value="JANUARY">JANUARY</option>
                <option value="FEBRUARY">FEBRUARY</option>
                <option value="MARCH">MARCH</option>
                <option value="APRIL">APRIL</option>
                <option value="MAY">MAY</option>
                <option value="JUNE">JUNE</option>
                <option value="JULY">JULY</option>
                <option value="AUGUST">AUGUST</option>
                <option value="SEPTEMBER">SEPTEMBER</option>
                <option value="OCTOBER">OCTOBER</option>
                <option value="NOVEMBER">NOVEMBER</option>
                <option value="DECEMBER">DECEMBER</option>
              </select>
              <button className="btn-add" onClick={() => openModal("addLeave")}>
                <FaPlus />
              </button>
            </div>
            <DataTable
              columns={leaveColumns}
              data={filteredLeaveData}
              showClearFilters={false}
              showExportCSV={false}
              showLedgerPDF={false}
              showSelection={false}
              showSearch={false}
              showFilters={false}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "viewAdvance"
            ? "View Worker Details"
            : modalType === "editAdvance"
            ? "Edit Worker Details"
            : modalType === "deleteAdvance"
            ? "Delete Worker"
            : modalType === "addAdvance"
            ? "Add Worker Advance"
            : modalType === "viewLeave"
            ? "View Leave Details"
            : modalType === "editLeave"
            ? "Edit Leave Details"
            : modalType === "addLeave"
            ? "Add Worker Leave"
            : modalType === "deleteLeave" && "Delete Worker Leave"
        }
        footer={
          <>
            {modalType === "deleteAdvance" ? (
              <button className="btn-danger" onClick={handleDeleteAdvance}>
                Delete
              </button>
            ) : modalType === "viewAdvance" ? (
              <button onClick={closeModal}>Close</button>
            ) : modalType === "editAdvance" || modalType === "addAdvance" ? (
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
            ) : modalType === "viewLeave" ? (
              <button onClick={closeModal}>Close</button>
            ) : modalType === "editLeave" || modalType === "addLeave" ? (
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
            ) : modalType === "deleteLeave" ? (
              <button className="btn-danger" onClick={handleDeleteLeave}>
                Delete
              </button>
            ) : null}
          </>
        }
      >
        {modalType === "viewAdvance" && workerAvanceData ? (
          <div style={{}}>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              {worker.name}
            </div>
            <hr />
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Date :- {formatDate(workerAvanceData.date)}</label>
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label>
                    Amount :- {formatRupees(workerAvanceData.amount)}
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label>Remarks :- {workerAvanceData.remarks}</label>
                </div>
              </div>
            </div>
          </div>
        ) : modalType === "editAdvance" || modalType === "addAdvance" ? (
          <>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formatDateForInput(workerAvanceData.date)}
                    onChange={handleChangeWorkerAdvanceData}
                    placeholder="Enter date"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={workerAvanceData.amount}
                    onChange={handleChangeWorkerAdvanceData}
                    placeholder="Enter amount"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
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
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={workerAvanceData.remarks}
                onChange={handleChangeWorkerAdvanceData}
                placeholder="Enter remarks"
              />
            </div>
          </>
        ) : modalType === "deleteAdvance" && workerAvanceData ? (
          <>
            <p>
              Are you sure you want to delete the worker "{worker.name}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={workerAvanceData.password}
                onChange={handleChangeWorkerAdvanceData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : modalType === "viewLeave" && workerLeaveData ? (
          <div style={{}}>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              {worker.name}
            </div>
            <hr />
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label>Date :- {formatDate(workerLeaveData.date)}</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label>Remarks :- {workerLeaveData.remarks}</label>
                </div>
              </div>
            </div>
          </div>
        ) : modalType === "editLeave" || modalType === "addLeave" ? (
          <>
            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formatDateForInput(workerLeaveData.date)}
                onChange={handleChangeWorkerLeaveData}
                placeholder="Enter date"
              />
            </div>
            <div className="input-group">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={workerLeaveData.remarks}
                onChange={handleChangeWorkerLeaveData}
                placeholder="Enter remarks"
              />
            </div>
          </>
        ) : modalType === "deleteLeave" && workerLeaveData ? (
          <>
            <p>
              Are you sure you want to delete the worker "{worker.name}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={workerLeaveData.password}
                onChange={handleChangeWorkerLeaveData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default SingleWorker;
