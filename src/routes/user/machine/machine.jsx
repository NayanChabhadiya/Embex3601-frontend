import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addMachine,
  deleteMachine,
  getMachinesByUser,
  updateMachine,
} from "../../../store/apiSlice/machineSlice";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/card/card";

const Machine = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  const { machines } = useSelector((state) => state.machines);
  const [filteredMachines, setFilteredMachines] = useState(machines);
  useEffect(() => {
    dispatch(getMachinesByUser(loggedInUserId));
    setFilteredMachines(machines);
  }, [dispatch, machines]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [machineData, setMachineData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    type: "",
    machineNo: "",
    heades: "",
    needles: "",
    brand: "",
    model: "",
    description: "",
  });

  const handleChangemachineData = (e) => {
    setMachineData({
      ...machineData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, machine = null) => {
    setModalType(type);
    if (type === "view") {
      setMachineData({
        loggedInUserId: loggedInUserId,
        _id: machine._id,
        machineNo: machine.machineNo || "",
        type: machine.type || "",
        heades: machine.heades || "",
        needles: machine.needles || "",
        brand: machine.brand || "",
        model: machine.model || "",
        description: machine.description || "",
      });
    } else if (type === "edit") {
      setMachineData({
        loggedInUserId: loggedInUserId,
        _id: machine ? machine._id : "",
        machineNo: machine.machineNo || "",
        type: machine.type || "",
        heades: machine.heades || "",
        needles: machine.needles || "",
        brand: machine.brand || "",
        model: machine.model || "",
        description: machine.description || "",
      });
    } else if (type === "delete") {
      setMachineData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: machine._id,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setMachineData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      type: "",
      machineNo: "",
      heades: "",
      needles: "",
      brand: "",
      model: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!machineData.machineNo) {
        showToast("Machine No is required", "error");
        return;
      } else if (!machineData.type) {
        showToast("Type is required", "error");
        return;
      } else if (!machineData.needles) {
        showToast("Needles is required", "error");
        return;
      } else if (!machineData.heades) {
        showToast("Heades is required", "error");
        return;
      } else if (!machineData.brand) {
        showToast("Brand is required", "error");
        return;
      } else if (!machineData.model) {
        showToast("Model is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateMachine(machineData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Machine updated successfully", "success");
            dispatch(getMachinesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update machine", "error");
          }
        });
      }
    } else {
      dispatch(startLoading());
      dispatch(addMachine(machineData)).then((res) => {
        if (res.payload.success) {
          dispatch(stopLoading());
          showToast("machine added successfully", "success");
          dispatch(getMachinesByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to add machine", "error");
        }
      });
    }
  };

  const handleDelete = () => {
    if (!machineData.password) {
      showToast("Password is required to delete the machine", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteMachine(machineData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Machine deleted successfully", "success");
          dispatch(getMachinesByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete worker", "error");
        }
      });
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Machine Management</h2>
          <button className="btn-add" onClick={() => handleSave()}>
            <FaPlus />
          </button>
        </div>
      </div>

      <Card
        data={filteredMachines}
        onView={(machine) => navigate(`/single-machine/${machine.machineNo}`)}
        onEdit={(machine) => openModal("edit", machine)}
        onDelete={(machine) => openModal("delete", machine)}
        // onSearch={(search) =>
        //   setFilteredMachines(
        //     machines.filter((w) =>
        //       `${w.machineNo}`.toLowerCase().includes(search.toLowerCase())
        //     )
        //   )
        // }
        titleKeys={["machineNo"]}
        bodyKeys={["type", "needles", "heades", "brand", "model"]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Machine"
            : modalType === "edit"
            ? "Edit Machine"
            : modalType === "delete"
            ? "Delete Machine"
            : "Add Machine"
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
        {modalType === "view" && machineData ? (
          <div style={{}}>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              {machineData.machineNo}
            </div>
          </div>
        ) : modalType === "edit" ? (
          <>
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Type</label>
                  <input
                    type="number"
                    name="type"
                    value={machineData.type}
                    onChange={handleChangemachineData}
                    placeholder="Enter type"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "+" ||
                        e.key === "."
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Needles</label>
                  <input
                    type="number"
                    name="needles"
                    value={machineData.needles}
                    onChange={handleChangemachineData}
                    placeholder="Enter needles"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "+" ||
                        e.key === "."
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Heades</label>
                  <input
                    type="number"
                    name="heades"
                    value={machineData.heades}
                    onChange={handleChangemachineData}
                    placeholder="Enter heades"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "+" ||
                        e.key === "."
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={machineData.brand}
                    onChange={handleChangemachineData}
                    placeholder="Enter brand"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label>Model</label>
                  <input
                    type="text"
                    name="model"
                    value={machineData.model}
                    onChange={handleChangemachineData}
                    placeholder="Enter model"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={machineData.description}
                onChange={handleChangemachineData}
                placeholder="Enter description"
              ></textarea>
            </div>
          </>
        ) : modalType === "delete" && machineData ? (
          <>
            <p>
              Are you sure you want to delete the machine no "
              {machineData.machineNo}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={machineData.password}
                onChange={handleChangemachineData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Machine;
