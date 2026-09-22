import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select, Textarea } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import { DeleteIcon, EditIcon, ViewIcon } from "../../components/common/icons";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./store/company.thunks.js";

import {
  selectCompanies,
  selectCompanyStatus,
} from "./store/company.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  name: "",
  legalName: "",
  code: "",
  companyType: "PROPRIETORSHIP",
  gstin: "",
  pan: "",
  email: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  status: "ACTIVE",
};

// ============================================================
// COMPANY TYPE OPTIONS
// ============================================================

const companyTypeOptions = [
  {
    value: "PROPRIETORSHIP",
    label: "Proprietorship",
  },
  {
    value: "PARTNERSHIP",
    label: "Partnership",
  },
  {
    value: "LLP",
    label: "LLP",
  },
  {
    value: "PRIVATE_LIMITED",
    label: "Private Limited",
  },
  {
    value: "PUBLIC_LIMITED",
    label: "Public Limited",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

// ============================================================
// STATUS OPTIONS
// ============================================================

const statusOptions = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

// ============================================================
// PAGE
// ============================================================

function CompanyPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // COMPANY REDUX STATE
  // ==========================================================

  const companies = useSelector(selectCompanies);

  const status = useSelector(selectCompanyStatus);

  // ==========================================================
  // ACTIVE WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING COMPANY
  // ==========================================================

  const [selectedCompany, setSelectedCompany] = useState(null);

  const [editingCompany, setEditingCompany] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH COMPANIES
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(fetchCompanies(selectedWorkspace._id));
  }, [dispatch, selectedWorkspace?._id]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingCompany(null);
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    resetForm();

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (company) => {
    setSelectedCompany(company);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (company) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingCompany(company);

    setFormData({
      name: company.name || "",
      legalName: company.legalName || "",
      code: company.code || "",
      companyType: company.companyType || "PROPRIETORSHIP",
      gstin: company.gstin || "",
      pan: company.pan || "",
      email: company.email || "",
      mobile: company.mobile || "",
      addressLine1: company.address?.addressLine1 || "",
      addressLine2: company.address?.addressLine2 || "",
      city: company.address?.city || "",
      state: company.address?.state || "",
      country: company.address?.country || "India",
      pincode: company.address?.pincode || "",
      status: company.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (company) => {
    const result = await dispatch(deleteCompany(company._id));

    if (deleteCompany.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Company Deleted",
        message: "Company deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete company.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // Workspace Required
    // --------------------------------------------------------

    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    // --------------------------------------------------------
    // Basic Validation
    // --------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter company name.",
      });

      return;
    }

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter company code.",
      });

      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      workspaceId: selectedWorkspace._id,

      name: formData.name.trim(),

      legalName: formData.legalName?.trim() || "",

      code: formData.code.trim().toUpperCase(),

      companyType: formData.companyType,

      gstin: formData.gstin?.trim().toUpperCase() || "",

      pan: formData.pan?.trim().toUpperCase() || "",

      email: formData.email?.trim().toLowerCase() || "",

      mobile: formData.mobile?.trim() || "",

      address: {
        addressLine1: formData.addressLine1?.trim() || "",

        addressLine2: formData.addressLine2?.trim() || "",

        city: formData.city?.trim() || "",

        state: formData.state?.trim() || "",

        country: formData.country?.trim() || "India",

        pincode: formData.pincode?.trim() || "",
      },

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingCompany) {
      const result = await dispatch(
        updateCompany({
          id: editingCompany._id,
          payload,
        }),
      );

      if (updateCompany.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Company Updated",
          message: "Company updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update company.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createCompany(payload));

    if (createCompany.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Company Created",
        message: "Company created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create company.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "name",
      label: "Name",
    },

    {
      key: "code",
      label: "Code",
    },

    {
      key: "companyType",
      label: "Company Type",

      render: (row) => row.companyType || "-",
    },

    {
      key: "gstin",
      label: "GSTIN",

      render: (row) => row.gstin || "-",
    },

    {
      key: "mobile",
      label: "Mobile",

      render: (row) => row.mobile || "-",
    },

    {
      key: "status",
      label: "Status",

      render: (row) => <Badge>{row.status || "-"}</Badge>,
    },

    {
      key: "actions",
      label: "Actions",

      render: (row) => (
        <>
          <ViewIcon size={5} title="View" onClick={() => handleView(row)} />

          <EditIcon size={5} title="Edit" onClick={() => handleEdit(row)} />

          <DeleteIcon
            size={5}
            title="Delete"
            onClick={() => handleDelete(row)}
          />
        </>
      ),
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section>
      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <PageHeader
        title="Companies"
        description="Manage workspace companies."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Company
          </Button>
        }
      />

      {/* ====================================================
          ACTIVE WORKSPACE
      ==================================================== */}

      {selectedWorkspace && (
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <strong>Active Workspace:</strong>{" "}
          {selectedWorkspace.name || selectedWorkspace.code || "-"}
        </div>
      )}

      {!selectedWorkspace && (
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <Badge>Please select a workspace</Badge>
        </div>
      )}

      {/* ====================================================
          COMPANY TABLE
      ==================================================== */}

      <Table
        title="Companies"
        columns={columns}
        data={companies}
        rowKey="_id"
        emptyMessage="No companies found."
        loading={status === "loading"}
        searchPlaceholder="Search companies..."
      />

      {/* ====================================================
          CREATE / EDIT MODAL
      ==================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          resetForm();
        }}
        title={editingCompany ? "Edit Company" : "Add Company"}
        footer={
          <>
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);

                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" form="company-form">
              {editingCompany ? "Update Company" : "Create Company"}
            </Button>
          </>
        }
      >
        <form id="company-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
            />

            <Input
              label="Legal Name"
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              placeholder="Enter legal name"
            />

            <Input
              label="Company Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter company code"
            />

            <Select
              label="Company Type"
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              options={companyTypeOptions}
            />

            <Input
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="Enter GSTIN"
            />

            <Input
              label="PAN"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              placeholder="Enter PAN"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            <Input
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />

            <Input
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Enter address"
            />

            <Input
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Enter address line 2"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />

            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW COMPANY MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedCompany(null);
        }}
        title="View Company"
      >
        {selectedCompany && (
          <Grid columns={1}>
            <div>
              <strong>Company Name</strong>

              <div>{selectedCompany.name || "-"}</div>
            </div>

            <div>
              <strong>Legal Name</strong>

              <div>{selectedCompany.legalName || "-"}</div>
            </div>

            <div>
              <strong>Company Code</strong>

              <div>{selectedCompany.code || "-"}</div>
            </div>

            <div>
              <strong>Company Type</strong>

              <div>{selectedCompany.companyType || "-"}</div>
            </div>

            <div>
              <strong>GSTIN</strong>

              <div>{selectedCompany.gstin || "-"}</div>
            </div>

            <div>
              <strong>PAN</strong>

              <div>{selectedCompany.pan || "-"}</div>
            </div>

            <div>
              <strong>Email</strong>

              <div>{selectedCompany.email || "-"}</div>
            </div>

            <div>
              <strong>Mobile</strong>

              <div>{selectedCompany.mobile || "-"}</div>
            </div>

            <div>
              <strong>Address</strong>

              <div>
                {[
                  selectedCompany.address?.addressLine1,
                  selectedCompany.address?.addressLine2,
                  selectedCompany.address?.city,
                  selectedCompany.address?.state,
                  selectedCompany.address?.country,
                  selectedCompany.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedCompany.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default CompanyPage;
