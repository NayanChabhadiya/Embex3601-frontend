import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addWorker,
  deleteWorker,
  getWorkerByUser,
  updateWorker,
} from "../../../store/apiSlice/workerSlice";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import Modal from "../../../components/modal/modal";
import { render } from "react-dom";
import {
  formatDate,
  formatDateForInput,
  formatRupees,
} from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/card/card";
import {
  calculateBalanceSalary,
  getLeaveMonthRange,
  getSalaryMonthRange,
} from "../../../utils/salaryMonth";

const Worker = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  const { workers } = useSelector((state) => state.workers);
  const [filteredWorkers, setFilteredWorkers] = useState(workers);
  useEffect(() => {
    dispatch(getWorkerByUser(loggedInUserId));
  }, [dispatch]);

  // Keep filteredWorkers in sync only when workers change initially
  useEffect(() => {
    setFilteredWorkers(workers);
  }, [workers]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [workerData, setWorkerData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    name: "",
    type: "",
    shift: "",
    salary: "",
    joiningDate: "",
  });

  const handleChangeWorkerData = (e) => {
    setWorkerData({
      ...workerData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, worker = null) => {
    setModalType(type);
    if (type === "view") {
      setWorkerData({
        loggedInUserId: loggedInUserId,
        _id: worker._id,
        name: worker.name,
        type: worker.type,
        shift: worker.shift,
        salary: worker.salary,
        joiningDate: worker.joiningDate,
      });
    } else if (type === "edit" || type === "add") {
      setWorkerData({
        loggedInUserId: loggedInUserId,
        _id: worker ? worker._id : "",
        name: worker ? worker.name : "",
        type: worker ? worker.type : "",
        shift: worker ? worker.shift : "",
        salary: worker ? worker.salary : "",
        joiningDate: worker ? formatDateForInput(worker.joiningDate) : "",
      });
    } else if (type === "delete") {
      setWorkerData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: worker._id,
        name: worker.name,
        type: worker.type,
        shift: worker.shift,
        salary: worker.salary,
        joiningDate: worker.joiningDate,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setWorkerData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      name: "",
      type: "",
      shift: "",
      salary: "",
      joiningDate: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!workerData.name) {
        showToast("Worker name is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateWorker(workerData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            dispatch(getWorkerByUser(loggedInUserId));
            showToast("Worker updated successfully", "success");
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update worker", "error");
          }
        });
      }
    } else {
      if (!workerData.name) {
        showToast("Worker name is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addWorker(workerData)).then((res) => {
          if (
            res.payload.message === "Worker with the same name already exists."
          ) {
            dispatch(stopLoading());
            showToast("Worker with the same name already exists.", "error");
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Worker added successfully", "success");
            dispatch(getWorkerByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add worker", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!workerData.password) {
      showToast("Password is required to delete the worker", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteWorker(workerData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Worker deleted successfully", "success");
          dispatch(getWorkerByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete worker", "error");
        }
      });
    }
  };

  // we do salary every month salary on next month 20 date so acording to it give salary moth like if curunt month is august date is 16 so disploay salary month is july
  const salaryMonth =
    new Date().getDate() >= 20
      ? new Date().toLocaleString("default", { month: "long" })
      : new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString(
          "default",
          { month: "long" }
        );

  // current year

  const salaryYear = new Date().getFullYear();

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Worker Management</h2>
          <div className="salary-info-row">
            <span className="title">Net Salary Payable</span>
            <span className="month">
              For {salaryMonth} - {salaryYear}
            </span>
            <span className="amount">
              {formatRupees(
                workers?.reduce(
                  (sum, worker) => sum + calculateBalanceSalary(worker),
                  0
                )
              )}
            </span>
          </div>
          <button className="btn-add" onClick={() => openModal("add")}>
            <FaPlus />
          </button>
        </div>
      </div>

      <Card
        data={filteredWorkers}
        onView={(worker) => navigate(`/single-worker/${worker.name}`)}
        onEdit={(worker) => openModal("edit", worker)}
        onDelete={(worker) => openModal("delete", worker)}
        onSearch={(search) => {
          if (!search.trim()) {
            setFilteredWorkers(workers);
          } else {
            setFilteredWorkers(
              workers.filter((w) =>
                w.name.toLowerCase().includes(search.toLowerCase())
              )
            );
          }
        }}
        titleKeys={[
          {
            label: "Name",
            render: (item, index) => `${index + 1}. ${item.name}`, // <-- Sr No. with name
          },
        ]}
        bodyKeys={[
          // {
          //   label: "Joining Date",
          //   render: (item) => formatDate(item.joiningDate) || "--",
          // },
          {
            label: "Shift",
            render: (item) => item.shift || "Not Assigned",
          },
          { label: "Salary", render: (item) => formatRupees(item.salary) },
          {
            label: "Total Advance",
            render: (item) => {
              const { start, end } = getSalaryMonthRange();
              return formatRupees(
                item.advanceHistory
                  ?.filter(
                    (a) => new Date(a.date) >= start && new Date(a.date) <= end
                  )
                  ?.reduce((sum, a) => sum + a.amount, 0) || 0
              );
            },
          },

          {
            label: "Balance Salary",
            render: (item) => formatRupees(calculateBalanceSalary(item)),
          },

          {
            label: "Total Leave",
            render: (item) => {
              const { start, end } = getLeaveMonthRange();
              return (
                item.leaveHistory?.filter(
                  (l) => new Date(l.date) >= start && new Date(l.date) <= end
                ).length || 0
              );
            },
          },
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Worker"
            : modalType === "edit"
            ? "Edit Worker"
            : modalType === "delete"
            ? "Delete Worker"
            : "Add Worker"
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
        {modalType === "view" && workerData ? (
          <div style={{}}>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              {workerData.name}
            </div>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={workerData.name}
                onChange={handleChangeWorkerData}
                placeholder="Enter worker name"
              />
            </div>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Worker Type</label>
                  <select
                    name="type"
                    value={workerData.type}
                    onChange={handleChangeWorkerData}
                  >
                    <option value="">Select Type</option>
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="HELPER">HELPER</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="ALTER">ALTER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="DESIGNER">DESIGNER</option>
                    <option value="DHAGA-CUTING">DHAGA-CUTING</option>
                    <option value="TEMPO">TEMPO</option>
                    <option value="PUNCHING">PUNCHING</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label>Shift</label>
                  <select
                    name="shift"
                    value={workerData.shift}
                    onChange={handleChangeWorkerData}
                  >
                    <option value="">Select Shift</option>
                    <option value="DAY">DAY</option>
                    <option value="NIGHT">NIGHT</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={workerData.salary}
                    onChange={handleChangeWorkerData}
                    placeholder="Enter salary"
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
                  <label>Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={workerData.joiningDate}
                    onChange={handleChangeWorkerData}
                    placeholder="Enter joining date"
                  />
                </div>
              </div>
            </div>
          </>
        ) : modalType === "delete" && workerData ? (
          <>
            <p>
              Are you sure you want to delete the worker "{workerData.name}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={workerData.password}
                onChange={handleChangeWorkerData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Worker;
