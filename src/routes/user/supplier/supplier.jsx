import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaWhatsapp,
  FaIdBadge,
} from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  addSupplier,
  assignUniqueIdToSupplier,
  deleteSupplier,
  getSuppliersByUser,
  isVerified,
  isWhatsapp,
  updateSupplier,
} from "../../../store/apiSlice/supplierSlice";
import { getSupplierCategoriesByUser } from "../../../store/apiSlice/supplierCategorySlice";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";

const Supplier = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getSuppliersByUser(loggedInUserId));
    dispatch(getSupplierCategoriesByUser(loggedInUserId));
  }, [dispatch]);

  const { suppliers } = useSelector((state) => state.suppliers);
  const { supplierCategories } = useSelector(
    (state) => state.supplierCategories
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [supplierData, setSupplierData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    uniqueId: "",
    name: "",
    supplierCategory: "",
    address: "",
    city: "",
    province: "",
    pinCode: "",
    country: "",
    contactPersonName: "",
    countryCode: "",
    mobileNo: "",
    email: "",
    website: "",
  });

  const handleChangeSupplierData = (e) => {
    setSupplierData({
      ...supplierData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, supplier = null) => {
    setModalType(type);
    if (type === "view") {
      setSupplierData({
        loggedInUserId: loggedInUserId,
        _id: supplier._id,
        uniqueId: supplier.uniqueId,
        name: supplier.name,
        supplierCategory: supplier.supplierCategory,
        address: supplier.address,
        city: supplier.city,
        province: supplier.province,
        pinCode: supplier.pinCode,
        country: supplier.country,
        contactPersonName: supplier.contactPersonName,
        countryCode: supplier.countryCode,
        mobileNo: supplier.mobileNo,
        email: supplier.email,
        website: supplier.website,
      });
    } else if (type === "edit" || type === "add") {
      setSupplierData({
        loggedInUserId: loggedInUserId,
        _id: supplier ? supplier._id : "",
        uniqueId: supplier ? supplier.uniqueId : "",
        name: supplier ? supplier.name : "",
        supplierCategory: supplier ? supplier.supplierCategory : "",
        address: supplier ? supplier.address : "",
        city: supplier ? supplier.city : "",
        province: supplier ? supplier.province : "",
        pinCode: supplier ? supplier.pinCode : "",
        country: supplier ? supplier.country : "",
        contactPersonName: supplier ? supplier.contactPersonName : "",
        countryCode: supplier ? supplier.countryCode : "",
        mobileNo: supplier ? supplier.mobileNo : "",
        email: supplier ? supplier.email : "",
        website: supplier ? supplier.website : "",
      });
    } else if (type === "delete") {
      setSupplierData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: supplier._id,
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setSupplierData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      uniqueId: "",
      name: "",
      supplierCategory: "",
      address: "",
      city: "",
      province: "",
      pinCode: "",
      country: "",
      contactPersonName: "",
      countryCode: "",
      mobileNo: "",
      email: "",
      website: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!supplierData.name) {
        showToast("Please enter company name", "error");
        return;
      } else if (!supplierData.supplierCategory) {
        showToast("Please select supplier category", "error");
        return;
      } else if (!supplierData.address) {
        showToast("Please enter address", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateSupplier(supplierData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Supplier updated successfully", "success");
            dispatch(getSuppliersByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update supplier", "error");
          }
        });
      }
    } else {
      if (!supplierData.name) {
        showToast("Please enter company name", "error");
        return;
      } else if (!supplierData.supplierCategory) {
        showToast("Please select supplier category", "error");
        return;
      } else if (!supplierData.address) {
        showToast("Please enter address", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addSupplier(supplierData)).then((res) => {
          if (
            res.payload.message ===
            "Supplier with the same name is already exists."
          ) {
            dispatch(stopLoading());
            showToast("Supplier with the same name already exists.", "error");
          } else if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Supplier added successfully", "success");
            dispatch(getSuppliersByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add supplier", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!supplierData.password) {
      showToast("Please enter your password to confirm deletion", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteSupplier(supplierData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Supplier deleted successfully", "success");
          dispatch(getSuppliersByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete supplier", "error");
        }
      });
    }
  };

  const handleVerify = (_id) => {
    dispatch(startLoading());
    dispatch(isVerified({ loggedInUserId, _id }))
      .then((res) => {
        if (res.payload.success) {
          dispatch(stopLoading());
          showToast(
            "Supplier verification status updated successfully",
            "success"
          );
          dispatch(getSuppliersByUser(loggedInUserId));
        } else {
          dispatch(stopLoading());
          showToast("Failed to verify supplier", "error");
        }
      })
      .catch((err) => {
        dispatch(stopLoading());
        showToast("Something went wrong", "error");
      });
  };

  const handleWhatsappVerify = (_id) => {
    dispatch(startLoading());
    dispatch(isWhatsapp({ loggedInUserId, _id }))
      .then((res) => {
        if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Whatsapp status updated successfully", "success");
          dispatch(getSuppliersByUser(loggedInUserId));
        } else {
          dispatch(stopLoading());
          showToast("Failed to verify supplier", "error");
        }
      })
      .catch((err) => {
        dispatch(stopLoading());
        showToast("Something went wrong", "error");
      });
  };

  const assignSupplierUniqueId = (_id) => {
    dispatch(startLoading());
    dispatch(assignUniqueIdToSupplier({ loggedInUserId, _id }))
      .then((res) => {
        if (res.payload.success) {
          dispatch(getSuppliersByUser(loggedInUserId));
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

  const data = suppliers?.map((supplier, index) => ({
    ...supplier,
    srNo: index + 1,
    uniqueId: supplier.uniqueId,
    name: supplier.name,
    contactPersonName: supplier.contactPersonName,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
  }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    { header: "Unique ID", accessor: "uniqueId", filterType: "text" },
    { header: "Company Name", accessor: "name", filterType: "text" },
    { header: "Name", accessor: "contactPersonName", filterType: "text" },
    {
      header: "Category",
      accessor: "supplierCategory",
      filterType: "dropdown",
      options: supplierCategories?.map((cat) => ({
        value: cat._id,
        label: cat.name,
      })),
      render: (value) => {
        const category = supplierCategories?.find((cat) => cat._id === value);
        return category?.name || "N/A";
      },
    },
    {
      header: "Is Verified",
      accessor: "isVerified",
      filterType: "text",
      render: (value) =>
        value ? (
          <span className="badge badge-verified">YES</span>
        ) : (
          <span className="badge badge-not-verified">NO</span>
        ),
    },
    {
      header: "Is Whatsapp",
      accessor: "isWhatsapp",
      filterType: "text",
      render: (value) =>
        value ? (
          <span className="badge badge-verified">YES</span>
        ) : (
          <span className="badge badge-not-verified">NO</span>
        ),
    },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => openModal("view", row),
          title: "View",
          type: "view",
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
        {
          icon: FaIdBadge,
          onClick: (row) => assignSupplierUniqueId(row._id),
          title: "ID Badge",
          type: "idBadge",
        },
        {
          icon: FaCheckCircle,
          onClick: (row) => handleVerify(row._id),
          title: "Confirm",
          type: "confirm",
        },
        {
          icon: FaWhatsapp,
          onClick: (row) => handleWhatsappVerify(row._id),
          title: "WhatsApp",
          type: "whatsapp",
        },
      ],
    },
  ];

  const exportFields = [
    { accessor: "name", header: "Supplier Name" },
    { accessor: "items", header: "Email" },
    { accessor: "items", header: "Items" },
  ];
  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Supplier Management</h2>
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
            ? "View Supplier"
            : modalType === "edit"
            ? "Edit Supplier"
            : modalType === "delete"
            ? "Delete Supplier"
            : "Add Supplier"
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
        {modalType === "view" && supplierData ? (
          <div>
            <p>
              <strong>Name:</strong> {supplierData.name}
            </p>
            <p>
              <strong>Unique ID:</strong> {supplierData.uniqueId}
            </p>
            <p>
              <strong>Email:</strong> {supplierData.email}
            </p>
            <p>
              <strong>Phone:</strong> {supplierData.mobileNo}
            </p>
            <p>
              <strong>Address:</strong> {supplierData.address}
            </p>
            <p>
              <strong>City:</strong> {supplierData.city}
            </p>
            <p>
              <strong>Province:</strong> {supplierData.province}
            </p>
            <p>
              <strong>Pin Code:</strong> {supplierData.pinCode}
            </p>
            <p>
              <strong>Country:</strong> {supplierData.country}
            </p>
            <p>
              <strong>Contact Person Name:</strong>{" "}
              {supplierData.contactPersonName}
            </p>
            <p>
              <strong>Country Code:</strong> {supplierData.countryCode}
            </p>
            <p>
              <strong>Website:</strong> {supplierData.website}
            </p>
            <p>
              <strong>Supplier Categories:</strong>{" "}
              {supplierCategories?.find(
                (cat) => cat._id === supplierData.supplierCategory
              )?.name || "N/A"}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="name">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={supplierData.name}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="supplierCategory">
                    Supplier Category Type
                  </label>
                  <select
                    name="supplierCategory"
                    value={supplierData.supplierCategory}
                    onChange={handleChangeSupplierData}
                  >
                    <option value="">Select Category</option>
                    {supplierCategories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className={modalType === "add" ? "col-12" : "col-8"}>
                <div className="input-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    name="address"
                    value={supplierData.address}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter item address"
                  ></textarea>
                </div>
              </div>
              {modalType === "edit" && (
                <div className="col-4">
                  <div className="input-group">
                    <label htmlFor="uniqueId">Unique ID</label>
                    <input
                      type="text"
                      name="uniqueId"
                      value={supplierData.uniqueId}
                      onChange={handleChangeSupplierData}
                      placeholder="Enter unique ID"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    value={supplierData.city}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter city"
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="province">Province</label>
                  <input
                    type="text"
                    name="province"
                    value={supplierData.province}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter province"
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="pinCode">Pin Code</label>
                  <input
                    type="number"
                    name="pinCode"
                    value={supplierData.pinCode}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter pin code"
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
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={supplierData.country}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="contactPersonName">Contact Person Name</label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={supplierData.contactPersonName}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="countryCode">Country Code</label>
                  <input
                    type="number"
                    name="countryCode"
                    value={supplierData.countryCode}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter country code"
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
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="mobileNo">Mobile No</label>
                  <input
                    type="text"
                    name="mobileNo"
                    value={supplierData.mobileNo}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter mobile number"
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
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={supplierData.email}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={supplierData.website}
                    onChange={handleChangeSupplierData}
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </div>
          </>
        ) : modalType === "delete" && supplierData ? (
          <>
            <p>
              Are you sure you want to delete the supplier "{supplierData.name}
              "?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={supplierData.password}
                onChange={handleChangeSupplierData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Supplier;
