import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addMachineProduction,
  allocateWorkerToMachine,
  deleteMachineProduction,
  deleteWorkerFromMachine,
  getMachinesByUser,
  isWorkerBounusPaid,
  updateMachineProduction,
  updateWorkerInMachine,
} from "../../../store/apiSlice/machineSlice";
import { FaCheckCircle, FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  formatDate,
  formatDateForInput,
  formatRupees,
} from "../../../utils/formatters";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { render } from "react-dom";

const SingleMachine = () => {
  const { machineNo } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getMachinesByUser(loggedInUserId));
    dispatch(getMachinesByUser(loggedInUserId));
  }, [dispatch]);

  const { machines } = useSelector((state) => state.machines);
  const { workers } = useSelector((state) => state.workers);
  const machine = machines?.find((machine) => machine.machineNo === machineNo);

  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const currentDate = new Date().toISOString().split("T")[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [machineWorkerData, setMachineWorkerData] = useState({
    loggedInUserId: loggedInUserId,
    _id: machine._id,
    machineId: machine.machineId,
    password: "",
    workerId: "",
    shift: "",
    startDate: currentDate,
    endDate: "",
    machineWorkerId: "",
  });

  const [machineProductionData, setMachineProductionData] = useState({
    loggedInUserId: loggedInUserId,
    _id: "",
    machineId: machine.machineId,
    machineProductionId: "",
    password: "",
    date: currentDate,
    shift: "",
    frame: "",
    totalProduction: "",
    bonusAmount: "",
    remarks: "",
    isBonusPaid: "",
  });

  const handleChangeMachineWorkerData = (e) => {
    setMachineWorkerData({
      ...machineWorkerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeProductionData = (e) => {
    setMachineProductionData({
      ...machineProductionData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, workerData = null) => {
    setModalType(type);

    if (type === "viewMachineWorker" && workerData) {
      setMachineWorkerData({
        ...machineWorkerData,
        loggedInUserId,
        _id: machine._id,
        workerId: workerData.workerId,
        machineWorkerId: workerData._id,
        shift: workerData.shift,
        startDate: workerData.startDate,
        endDate: workerData.endDate || "",
      });
    } else if (type === "editMachineWorker" && workerData) {
      setMachineWorkerData({
        ...machineWorkerData,
        loggedInUserId,
        _id: machine?._id,
        machineWorkerId: workerData._id,
        workerId: workerData.workerId || "",
        shift: workerData.shift || "",
        startDate: workerData.startDate || "",
        endDate: workerData.endDate || "",
      });
    } else if (type === "allocateWorker" && workerData) {
      setMachineWorkerData({
        ...machineWorkerData,
        loggedInUserId,
        machineId: machine._id,
        _id: machine?._id || "",
        workerId: "",
        machineWorkerId: "",
        shift: "",
        password: "",
        startDate: currentDate,
        endDate: "",
      });
    } else if (type === "deleteMachineWorker" && workerData) {
      setMachineWorkerData({
        ...machineWorkerData,
        loggedInUserId,
        _id: machine._id,
        machineWorkerId: workerData._id,
        password: "",
      });
    } else if (type === "viewMachineProduction" && workerData) {
      setMachineProductionData({
        ...machineProductionData,
        loggedInUserId,
        machineId: machine._id,
        _id: machine._id,
        machineProductionId: workerData._id,
        date: workerData.date,
        shift: workerData.shift || "",
        frame: workerData.frame,
        totalProduction: workerData.totalProduction,
        bonusAmount: workerData.bonusAmount,
        remarks: workerData.remarks,
      });
    } else if (type === "editMachineProduction" && workerData) {
      setMachineProductionData({
        ...machineProductionData,
        loggedInUserId,
        _id: machine?._id,
        machineId: machine._id,
        machineProductionId: workerData._id,
        date: workerData.date,
        shift: workerData.shift || "",
        frame: workerData.frame || "",
        totalProduction: workerData.totalProduction || "",
        bonusAmount: workerData.bonusAmount || "",
        remarks: workerData.remarks || "",
      });
    } else if (type === "addMachineProduction" && workerData) {
      setMachineProductionData({
        ...machineProductionData,
        loggedInUserId,
        _id: machine?._id || "",
        machineId: machine._id,
        date: currentDate,
        shift: "",
        frame: "",
        totalProduction: "",
        bonusAmount: "",
        remarks: "",
      });
    } else if (type === "deleteMachineProduction" && workerData) {
      setMachineProductionData({
        ...machineProductionData,
        loggedInUserId,
        _id: machine._id,
        machineId: machine._id,
        machineProductionId: workerData._id,
        password: "",
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setMachineWorkerData({
      loggedInUserId: loggedInUserId,
      _id: machine ? machine._id : "",
      workerId: "",
      machineWorkerId: "",
      shift: "",
      password: "",
      startDate: "",
      endDate: "",
    });
    setMachineProductionData({
      loggedInUserId: loggedInUserId,
      _id: machine ? machine._id : "",
      password: "",
      machineProductionId: "",
      date: currentDate,
      shift: "",
      frame: "",
      totalProduction: "",
      bonusAmount: "",
      remarks: "",
      isBonusPaid: "",
    });
  };

  const handleSave = () => {
    if (modalType === "editMachineWorker") {
      if (!machineWorkerData.workerId) {
        showToast("Please select worker", "error");
        return;
      } else if (!machineWorkerData.shift) {
        showToast("Please select shift", "error");
        return;
      } else if (!machineWorkerData.startDate) {
        showToast("Please add work starting date", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateWorkerInMachine(machineWorkerData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Machine worker updated successfully", "success");
            dispatch(getMachinesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update machine worker", "error");
          }
        });
      }
    } else if (modalType === "allocateWorker") {
      if (!machineWorkerData.workerId) {
        showToast("Please select worker", "error");
        return;
      } else if (!machineWorkerData.shift) {
        showToast("Please select shift", "error");
        return;
      } else if (!machineWorkerData.startDate) {
        showToast("Please add work starting date", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(allocateWorkerToMachine(machineWorkerData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Worker allocated successfully to machine", "success");
            dispatch(getMachinesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to allocate worker to machine", "error");
          }
        });
      }
    } else if (modalType === "editMachineProduction") {
      if (!machineProductionData.date) {
        showToast("Date is required", "error");
        return;
      } else if (!machineProductionData.shift) {
        showToast("Please select shift", "error");
        return;
      } else if (!machineProductionData.frame) {
        showToast("Please add total frame", "error");
        return;
      } else if (!machineProductionData.totalProduction) {
        showToast("Please add total production", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateMachineProduction(machineProductionData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Machine production updated successfully", "success");
            dispatch(getMachinesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update machine production", "error");
          }
        });
      }
    } else if (modalType === "addMachineProduction") {
      if (!machineProductionData.date) {
        showToast("Date is required", "error");
        return;
      } else if (!machineProductionData.shift) {
        showToast("Please select shift", "error");
        return;
      } else if (!machineProductionData.frame) {
        showToast("Please add total frame", "error");
        return;
      } else if (!machineProductionData.totalProduction) {
        showToast("Please add total production", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addMachineProduction(machineProductionData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Machine production added successfully", "success");
            dispatch(getMachinesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add machine production", "error");
          }
        });
      }
    }
  };

  const handleDeleteWorkerFromMachine = () => {
    if (!machineWorkerData.password) {
      showToast(
        "Password is required to delete the worker from machine",
        "error"
      );
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteWorkerFromMachine(machineWorkerData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Worker deleted successfully from machine", "success");
          dispatch(getMachinesByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete worker from machine", "error");
        }
      });
    }
  };

  const handleDeleteMachineProduction = () => {
    if (!machineProductionData.password) {
      showToast("Password is required to delete machine production", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteMachineProduction(machineProductionData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Machine production deleted successfully", "success");
          dispatch(getMachinesByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete machine production", "error");
        }
      });
    }
  };

  const handleIsBounusPaid = (machineProductionId) => {
    dispatch(startLoading());
    dispatch(
      isWorkerBounusPaid({
        loggedInUserId,
        _id: machine._id,
        machineProductionId,
      })
    )
      .then((res) => {
        if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Bounus status updated successfully", "success");
          dispatch(getMachinesByUser(loggedInUserId));
        } else {
          dispatch(stopLoading());
          showToast("Failed to update bounus status", "error");
        }
      })
      .catch((err) => {
        dispatch(stopLoading());
        showToast("Something went wrong", "error");
      });
  };

  const workersData = machine?.workerHistory?.map((workerData, index) => ({
    ...workerData,
    srNo: index + 1,
    _id: machine._id,
    workerId: workerData.workerId,
    shift: workerData.shift,
    startDate: workerData.startDate,
    endDate: workerData.endDate || "",
    machineWorkerId: workerData._id,
  }));

  const productionsData = machine?.productionHistory?.map(
    (productionData, index) => ({
      ...productionData,
      srNo: index + 1,
      _id: productionData._id,
      date: productionData.date,
      frame: productionData.frame,
      totalProduction: productionData.totalProduction,
      bonusAmount: productionData.bonusAmount,
      remarks: productionData.remarks,
      isBonusPaid: productionData.isBonusPaid,
    })
  );

  const [selectedWorkerMonth, setSelectedWorkerMonth] = useState(currentMonth);

  const filteredWorkerData = workersData?.filter((item) => {
    const itemMonth = new Date(item.startDate)
      .toLocaleString("default", { month: "long" })
      .toUpperCase();
    if (!selectedWorkerMonth) return true;

    return itemMonth === selectedWorkerMonth;
  });

  const [selectedProductionMonth, setSelectedProductionMonth] =
    useState(currentMonth);

  const filteredProductionData = productionsData?.filter((item) => {
    const itemMonth = new Date(item.date)
      .toLocaleString("default", { month: "long" })
      .toUpperCase();
    if (!selectedProductionMonth) return true;
    return itemMonth === selectedProductionMonth;
  });

  const workersColumns = [
    { header: "Sr No", accessor: "srNo" },
    {
      header: "Worker Name",
      accessor: "workerId",
      render: (value) => {
        const worker = workers?.find((w) => w._id === value);
        return worker ? worker.name : "N/A";
      },
    },
    {
      header: "Shift",
      accessor: "shift",
    },
    {
      header: "Start Date",
      accessor: "startDate",
      render: (value) => formatDate(value),
    },
    {
      header: "End Date",
      accessor: "endDate",
      render: (value) => formatDate(value),
    },

    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => openModal("viewMachineWorker", row),
          title: "View",
          type: "view",
        },
        ,
        {
          icon: FaEdit,
          onClick: (row) => openModal("editMachineWorker", row),
          title: "Edit",
          type: "edit",
        },
        {
          icon: FaTrash,
          onClick: (row) => openModal("deleteMachineWorker", row),
          title: "Delete",
          type: "delete",
        },
      ],
    },
  ];

  const productionColumns = [
    { header: "Sr No", accessor: "srNo" },
    {
      header: "Date",
      accessor: "date",
      render: (value) => formatDate(value),
    },
    { header: "Frame", accessor: "frame" },
    { header: "Production", accessor: "totalProduction" },
    {
      header: "Bonus",
      accessor: "bonusAmount",
      render: (value) => formatRupees(value),
    },
    {
      header: "Bonus Paid",
      accessor: "isBonusPaid",
      render: (value) => (value ? "Paid" : "Not Paid"),
    },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => openModal("viewMachineProduction", row),
          title: "View",
          type: "view",
        },
        {
          icon: FaEdit,
          onClick: (row) => openModal("editMachineProduction", row),
          title: "Edit",
          type: "edit",
        },
        {
          icon: FaCheckCircle,
          onClick: (row) => handleIsBounusPaid(row._id),
          title: "Confirm",
          type: "confirm",
        },
        {
          icon: FaTrash,
          onClick: (row) => openModal("deleteMachineProduction", row),
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
              Data for Machine No : {machine?.machineNo || "N/A"}
            </h2>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="left-section">
            <div className="section-header">
              <h2 className="section-title">Worker History</h2>
              <select
                value={selectedWorkerMonth}
                onChange={(e) => setSelectedWorkerMonth(e.target.value)}
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
                onClick={() => openModal("allocateWorker")}
              >
                <FaPlus />
              </button>
            </div>
            <DataTable
              columns={workersColumns}
              data={filteredWorkerData}
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
              <h2 className="section-title">Machine Production History</h2>
              <select
                value={selectedProductionMonth}
                onChange={(e) => setSelectedProductionMonth(e.target.value)}
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
                onClick={() => openModal("addMachineProduction")}
              >
                <FaPlus />
              </button>
            </div>
            <DataTable
              columns={productionColumns}
              data={filteredProductionData}
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
          modalType === "viewMachineWorker"
            ? "View Worker Of Machine"
            : modalType === "editMachineWorker"
            ? "Edit Worker Of Machine"
            : modalType === "deleteMachineWorker"
            ? "Delete Worker From Machine"
            : modalType === "allocateWorker"
            ? "Add Worker to Machine"
            : modalType === "viewMachineProduction"
            ? "View Machine Production Details"
            : modalType === "editMachineProduction"
            ? "Edit Machine Production Details"
            : modalType === "addMachineProduction"
            ? "Add Machine Production Details"
            : modalType === "deleteMachineProduction" &&
              "Delete Machine Production details"
        }
        footer={
          <>
            {modalType === "deleteMachineWorker" ? (
              <button
                className="btn-danger"
                onClick={handleDeleteWorkerFromMachine}
              >
                Delete
              </button>
            ) : modalType === "viewMachineWorker" ? (
              <button onClick={closeModal}>Close</button>
            ) : modalType === "editMachineWorker" ||
              modalType === "allocateWorker" ? (
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
            ) : modalType === "viewMachineProduction" ? (
              <button onClick={closeModal}>Close</button>
            ) : modalType === "editMachineProduction" ||
              modalType === "addMachineProduction" ? (
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
            ) : modalType === "deleteMachineProduction" ? (
              <button
                className="btn-danger"
                onClick={handleDeleteMachineProduction}
              >
                Delete
              </button>
            ) : null}
          </>
        }
      >
        {modalType === "viewMachineWorker" && machineWorkerData ? (
          <div style={{}}>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              {workers?.find(
                (worker) => worker._id === machineWorkerData.workerId
              )?.name || "N/A"}
            </div>
            <hr />

            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Shift</label>
                  <label>{machineWorkerData.shift}</label>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Start Date</label>
                  <label>
                    {formatDate(machineWorkerData.startDate) || "N/A"}
                  </label>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>End Date</label>
                  <label>
                    {machineWorkerData.endDate
                      ? formatDate(machineWorkerData.endDate)
                      : "N/A"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : modalType === "editMachineWorker" ||
          modalType === "allocateWorker" ? (
          <>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label>Worker</label>
                  <select
                    name="workerId"
                    value={machineWorkerData.workerId}
                    onChange={handleChangeMachineWorkerData}
                    placeholder="Select worker"
                  >
                    <option value="">Select Worker</option>
                    {workers?.map((worker) => (
                      <option key={worker._id} value={worker._id}>
                        {worker.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Shift</label>
                  <select
                    name="shift"
                    value={machineWorkerData.shift}
                    onChange={handleChangeMachineWorkerData}
                    placeholder="Select shift"
                  >
                    <option value="">Select Shift</option>
                    <option value="DAY">DAY</option>
                    <option value="NIGHT">NIGHT</option>
                  </select>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formatDateForInput(machineWorkerData.startDate)}
                    onChange={handleChangeMachineWorkerData}
                    placeholder="Enter start date"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formatDateForInput(machineWorkerData.endDate)}
                    onChange={handleChangeMachineWorkerData}
                    placeholder="Enter end date"
                  />
                </div>
              </div>
            </div>
          </>
        ) : modalType === "deleteMachineWorker" && machineWorkerData ? (
          <>
            <p>
              Are you sure you want to delete the worker from machine no "
              {machine.machineNo}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={machineWorkerData.password}
                onChange={handleChangeMachineWorkerData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : modalType === "viewMachineProduction" && machineProductionData ? (
          <div style={{}}>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              {formatDate(machineProductionData.date)} -{" "}
              {machineProductionData.shift}
            </div>
            <hr />
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Frame</label>
                  <label>{machineProductionData.frame}</label>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Total Production</label>
                  <label>{machineProductionData.totalProduction}</label>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Bonus Amount</label>
                  <label>
                    {formatRupees(machineProductionData.bonusAmount)}
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label>Remarks :- {machineProductionData.remarks}</label>
                </div>
              </div>
            </div>
          </div>
        ) : modalType === "editMachineProduction" ||
          modalType === "addMachineProduction" ? (
          <>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formatDateForInput(machineProductionData.date)}
                    onChange={handleChangeProductionData}
                    placeholder="Enter date"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label>Shift</label>
                  <select
                    name="shift"
                    value={machineProductionData.shift}
                    onChange={handleChangeProductionData}
                    placeholder="Select shift"
                  >
                    <option value="">Select Shift</option>
                    <option value="DAY">DAY</option>
                    <option value="NIGHT">NIGHT</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Frame</label>
                  <input
                    type="text"
                    name="frame"
                    value={machineProductionData.frame}
                    onChange={handleChangeProductionData}
                    placeholder="Enter frame"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Total Production</label>
                  <input
                    type="number"
                    name="totalProduction"
                    value={machineProductionData.totalProduction}
                    onChange={handleChangeProductionData}
                    placeholder="Enter total production"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Bonus Amount</label>
                  <input
                    type="number"
                    name="bonusAmount"
                    value={machineProductionData.bonusAmount}
                    onChange={handleChangeProductionData}
                    placeholder="Enter bonus amount"
                  />
                </div>
              </div>
            </div>
          </>
        ) : modalType === "deleteMachineProduction" && machineProductionData ? (
          <>
            <p>
              Are you sure you want to delete the worker "{machine.machineNo}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={machineProductionData.password}
                onChange={handleChangeProductionData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default SingleMachine;
