import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addCompany,
  deleteCompany,
  getCompaniesByUser,
  updateCompany,
} from "../../../store/apiSlice/companySlice";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";

const Company = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getCompaniesByUser(loggedInUserId));
  }, [dispatch]);

  const { companies } = useSelector((state) => state.companies);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [companyData, setCompanyData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    name: "",
    gstNo: "",
    udyamNo: "",
    pancardNo: "",
    address: "",
    bankDetails: {
      bankName: "",
      ifscCode: "",
      branchName: "",
      accountNumber: "",
      accountName: "",
    },
    contactDetails: [{ name: "", mobileNo: "" }],
    termsAndConditions: [""],
  });

  const handleChangeCompanyData = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (type, company = null) => {
    setModalType(type);
    if (type === "view") {
      setCompanyData({
        loggedInUserId: loggedInUserId,
        _id: company._id,
        name: company.name,
        gstNo: company.gstNo,
        udyamNo: company.udyamNo,
        pancardNo: company.pancardNo,
        address: company.address,
        bankDetails: company.bankDetails,
        contactDetails: company.contactDetails,
        termsAndConditions: company.termsAndConditions,
      });
    } else if (type === "edit" || type === "add") {
      setCompanyData({
        loggedInUserId: loggedInUserId,
        _id: company ? company._id : "",
        name: company ? company.name : "",
        gstNo: company ? company.gstNo : "",
        udyamNo: company ? company.udyamNo : "",
        pancardNo: company ? company.pancardNo : "",
        address: company ? company.address : "",
        bankDetails: company
          ? company.bankDetails
          : {
              bankName: "",
              ifscCode: "",
              branchName: "",
              accountNumber: "",
              accountName: "",
            },
        contactDetails: Array.isArray(company?.contactDetails)
          ? company.contactDetails
          : [{ name: "", mobileNo: "" }],
        termsAndConditions: Array.isArray(company?.termsAndConditions)
          ? company.termsAndConditions
          : [""],
      });
    } else if (type === "delete") {
      setCompanyData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: company._id,
        name: company.name,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setCompanyData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      name: "",
      gstNo: "",
      udyamNo: "",
      pancardNo: "",
      address: "",
      bankDetails: {
        bankName: "",
        ifscCode: "",
        branchName: "",
        accountNumber: "",
        accountName: "",
      },
      contactDetails: {
        name: "",
        mobileNo: "",
      },
      termsAndConditions: [""],
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (!companyData.name) {
        showToast("Company name is required", "error");
        return;
      } else if (!companyData.gstNo) {
        showToast("GST number is required", "error");
        return;
      } else if (!companyData.udyamNo) {
        showToast("Udyam number is required", "error");
        return;
      } else if (!companyData.pancardNo) {
        showToast("Pancard number is required", "error");
        return;
      } else if (!companyData.address) {
        showToast("Address is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateCompany(companyData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Company updated successfully", "success");
            dispatch(getCompaniesByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update company", "error");
          }
        });
      }
    } else {
      if (!companyData.name) {
        showToast("Company name is required", "error");
        return;
      } else if (!companyData.gstNo) {
        showToast("GST number is required", "error");
        return;
      } else if (!companyData.udyamNo) {
        showToast("Udyam number is required", "error");
        return;
      } else if (!companyData.pancardNo) {
        showToast("Pancard number is required", "error");
        return;
      } else if (!companyData.address) {
        showToast("Address is required", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addCompany(companyData)).then((res) => {
          if (
            res.payload.message ===
            "Company with the same name and GST Number already exists."
          ) {
            showToast(
              "Company with the same name and GST Number already exists.",
              "error"
            );
          } else if (res.payload.success) {
            showToast("Company added successfully", "success");
            dispatch(getCompaniesByUser(loggedInUserId));
            closeModal();
            dispatch(stopLoading());
          } else {
            showToast("Failed to add company", "error");
            dispatch(stopLoading());
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!companyData.password) {
      showToast("Password is required to delete the company", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteCompany(companyData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Company deleted successfully", "success");
          dispatch(getCompaniesByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete company", "error");
        }
      });
    }
  };

  const data = companies?.map((company, index) => ({
    ...company,
    _id: company._id,
    srNo: index + 1,
    name: company.name,
    gstNo: company.gstNo,
    udyamNo: company.udyamNo,
    pancardNo: company.pancardNo,
    address: company.address,
    bankDetails: company.bankDetails,
    contactDetails: company.contactDetails,
    termsAndConditions: company.termsAndConditions,
  }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    { header: "Company Name", accessor: "name", filterType: "text" },
    { header: "GST No", accessor: "gstNo", filterType: "text" },
    { header: "Udyam No", accessor: "udyamNo", filterType: "text" },
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
      ],
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Company Management</h2>
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
          modalType === "view"
            ? "View Company"
            : modalType === "edit"
            ? "Edit Company"
            : modalType === "delete"
            ? "Delete Company"
            : "Add Company"
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
        {modalType === "view" && companyData ? (
          <div>
            <p>
              <strong>Name:</strong> {companyData.name}
            </p>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={companyData.name}
                    onChange={handleChangeCompanyData}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="gstNo">GST No</label>
                  <input
                    type="text"
                    name="gstNo"
                    value={companyData.gstNo}
                    onChange={handleChangeCompanyData}
                    placeholder="Enter GST number"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="udyamNo">Udyam No</label>
                  <input
                    type="text"
                    name="udyamNo"
                    value={companyData.udyamNo}
                    onChange={handleChangeCompanyData}
                    placeholder="Enter Udyam number"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="pancardNo">Pancard No</label>
                  <input
                    type="text"
                    name="pancardNo"
                    value={companyData.pancardNo}
                    onChange={handleChangeCompanyData}
                    placeholder="Enter Pancard number"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    name="address"
                    value={companyData.address}
                    onChange={handleChangeCompanyData}
                    placeholder="Enter company address"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="bankName">Bank Name</label>
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    value={companyData.bankDetails.bankName}
                    onChange={(e) => {
                      const updatedBankDetails = {
                        ...companyData.bankDetails,
                        bankName: e.target.value,
                      };
                      setCompanyData({
                        ...companyData,
                        bankDetails: updatedBankDetails,
                      });
                    }}
                    placeholder="Enter bank name"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="ifscCode">IFSC Code</label>
                  <input
                    type="text"
                    name="bankDetails.ifscCode"
                    value={companyData.bankDetails.ifscCode}
                    onChange={(e) => {
                      const updatedBankDetails = {
                        ...companyData.bankDetails,
                        ifscCode: e.target.value,
                      };
                      setCompanyData({
                        ...companyData,
                        bankDetails: updatedBankDetails,
                      });
                    }}
                    placeholder="Enter IFSC code"
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="branchName">Branch Name</label>
                  <input
                    type="text"
                    name="bankDetails.branchName"
                    value={companyData.bankDetails.branchName}
                    onChange={(e) => {
                      const updatedBankDetails = {
                        ...companyData.bankDetails,
                        branchName: e.target.value,
                      };
                      setCompanyData({
                        ...companyData,
                        bankDetails: updatedBankDetails,
                      });
                    }}
                    placeholder="Enter branch name"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="accountName">Account Name</label>
                  <input
                    type="text"
                    name="bankDetails.accountName"
                    value={companyData.bankDetails.accountName}
                    onChange={(e) => {
                      const updatedBankDetails = {
                        ...companyData.bankDetails,
                        accountName: e.target.value,
                      };
                      setCompanyData({
                        ...companyData,
                        bankDetails: updatedBankDetails,
                      });
                    }}
                    placeholder="Enter account name"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="accountNumber">Account Number</label>
                  <input
                    type="number"
                    name="bankDetails.accountNumber"
                    value={companyData.bankDetails.accountNumber}
                    onChange={(e) => {
                      const updatedBankDetails = {
                        ...companyData.bankDetails,
                        accountNumber: e.target.value,
                      };
                      setCompanyData({
                        ...companyData,
                        bankDetails: updatedBankDetails,
                      });
                    }}
                    placeholder="Enter account number"
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
              <div className="col-12">
                <div className="input-group">
                  <label>Contact Details</label>
                  {Array.isArray(companyData.contactDetails) &&
                    companyData.contactDetails?.map((contact, index) => (
                      <div key={index} className="dynamic-field-row">
                        <input
                          type="text"
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => {
                            const updated = companyData.contactDetails?.map(
                              (c, i) =>
                                i === index ? { ...c, name: e.target.value } : c
                            );
                            setCompanyData({
                              ...companyData,
                              contactDetails: updated,
                            });
                          }}
                        />

                        <input
                          type="number"
                          placeholder="Mobile No"
                          value={contact.mobileNo}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const updated = companyData.contactDetails?.map(
                              (c, i) =>
                                i === index ? { ...c, mobileNo: value } : c
                            );
                            setCompanyData({
                              ...companyData,
                              contactDetails: updated,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "e" ||
                              e.key === "E" ||
                              e.key === "+" ||
                              e.key === "-" ||
                              e.key === "." ||
                              e.keyCode === 38 ||
                              e.keyCode === 40
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(event) => event.currentTarget.blur()}
                        />

                        {companyData.contactDetails?.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => {
                              const updated =
                                companyData.contactDetails?.filter(
                                  (_, i) => i !== index
                                );
                              setCompanyData({
                                ...companyData,
                                contactDetails: updated,
                              });
                            }}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                  <button
                    type="button"
                    className="btn-add"
                    onClick={() =>
                      setCompanyData({
                        ...companyData,
                        contactDetails: [
                          ...(Array.isArray(companyData.contactDetails)
                            ? companyData.contactDetails
                            : []),
                          { name: "", mobileNo: "" },
                        ],
                      })
                    }
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <label>Terms and Conditions</label>
                  {companyData.termsAndConditions?.map((term, index) => (
                    <div key={index} className="dynamic-field-row">
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => {
                          const updated = [...companyData.termsAndConditions];
                          updated[index] = e.target.value;
                          setCompanyData({
                            ...companyData,
                            termsAndConditions: updated,
                          });
                        }}
                        placeholder={`Condition ${index + 1}`}
                      />

                      {companyData.termsAndConditions?.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated =
                              companyData.termsAndConditions?.filter(
                                (_, i) => i !== index
                              );
                            setCompanyData({
                              ...companyData,
                              termsAndConditions: updated,
                            });
                          }}
                          className="btn-remove"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add"
                    onClick={() =>
                      setCompanyData({
                        ...companyData,
                        termsAndConditions: [
                          ...companyData.termsAndConditions,
                          "",
                        ],
                      })
                    }
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : modalType === "delete" && companyData ? (
          <>
            <p>
              Are you sure you want to delete the company "{companyData.name}"?
            </p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={companyData.password}
                onChange={handleChangeCompanyData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Company;
