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
  fetchPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from "./store/partner.thunks.js";

import {
  selectPartners,
  selectPartnerStatus,
} from "./store/partner.selectors.js";

import { selectCompanies } from "../company/store/company.selectors.js";

import { selectBranches } from "../branch/store/branch.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  partnerType: "CUSTOMER",

  name: "",
  code: "",
  displayName: "",

  contactPerson: "",
  mobile: "",
  alternateMobile: "",
  email: "",
  website: "",

  gstin: "",
  pan: "",

  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  openingBalance: "",
  currentBalance: "",
  creditLimit: "",
  creditDays: "",

  status: "ACTIVE",
};

// ============================================================
// PARTNER TYPE OPTIONS
// ============================================================

const partnerTypeOptions = [
  {
    value: "CUSTOMER",
    label: "Customer",
  },
  {
    value: "SUPPLIER",
    label: "Supplier",
  },
  {
    value: "JOB_WORKER",
    label: "Job Worker",
  },
  {
    value: "BOTH",
    label: "Customer & Supplier",
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

function PartnerPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // PARTNER REDUX STATE
  // ==========================================================

  const partners = useSelector(selectPartners);

  const status = useSelector(selectPartnerStatus);

  // ==========================================================
  // COMPANIES
  // ==========================================================

  const companies = useSelector(selectCompanies);

  // ==========================================================
  // BRANCHES
  // ==========================================================

  const branches = useSelector(selectBranches);

  // ==========================================================
  // COMPANY FILTER
  // ==========================================================

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // ==========================================================
  // BRANCH FILTER
  // ==========================================================

  const [selectedBranchId, setSelectedBranchId] = useState("");

  // ==========================================================
  // PARTNER TYPE FILTER
  // ==========================================================

  const [selectedPartnerType, setSelectedPartnerType] = useState("");

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING PARTNER
  // ==========================================================

  const [selectedPartner, setSelectedPartner] = useState(null);

  const [editingPartner, setEditingPartner] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // COMPANY OPTIONS
  // ==========================================================

  const companyOptions = companies.map((company) => ({
    value: company._id,
    label: company.name || company.code || company._id,
  }));

  // ==========================================================
  // BRANCH OPTIONS
  // ==========================================================

  const branchOptions = branches
    .filter((branch) => {
      if (!selectedCompanyId) {
        return true;
      }

      const branchCompanyId =
        typeof branch.companyId === "object"
          ? branch.companyId?._id
          : branch.companyId;

      return branchCompanyId === selectedCompanyId;
    })
    .map((branch) => ({
      value: branch._id,
      label: branch.name || branch.code || branch._id,
    }));

  // ==========================================================
  // FETCH PARTNERS / INITIAL DATA
  // ==========================================================

  useEffect(() => {
    if (!companies?.length) {
      return;
    }

    if (!selectedCompanyId) {
      const firstCompanyId = companies[0]?._id;

      if (firstCompanyId) {
        setSelectedCompanyId(firstCompanyId);

        dispatch(
          fetchPartners({
            companyId: firstCompanyId,
          }),
        );
      }

      return;
    }

    const companyExists = companies.some(
      (company) => company._id === selectedCompanyId,
    );

    if (!companyExists) {
      const firstCompanyId = companies[0]?._id;

      if (firstCompanyId) {
        setSelectedCompanyId(firstCompanyId);

        dispatch(
          fetchPartners({
            companyId: firstCompanyId,
          }),
        );
      }

      return;
    }

    dispatch(
      fetchPartners({
        companyId: selectedCompanyId,
        ...(selectedBranchId
          ? {
              branchId: selectedBranchId,
            }
          : {}),
        ...(selectedPartnerType
          ? {
              partnerType: selectedPartnerType,
            }
          : {}),
      }),
    );
  }, [
    dispatch,
    companies,
    selectedCompanyId,
    selectedBranchId,
    selectedPartnerType,
  ]);

  // ==========================================================
  // COMPANY FILTER CHANGE
  // ==========================================================

  const handleCompanyFilterChange = (event) => {
    const { value } = event.target;

    setSelectedCompanyId(value);

    setSelectedBranchId("");

    if (value) {
      dispatch(
        fetchPartners({
          companyId: value,
        }),
      );
    }
  };

  // ==========================================================
  // BRANCH FILTER CHANGE
  // ==========================================================

  const handleBranchFilterChange = (event) => {
    const { value } = event.target;

    setSelectedBranchId(value);

    if (!selectedCompanyId) {
      return;
    }

    dispatch(
      fetchPartners({
        companyId: selectedCompanyId,
        ...(value
          ? {
              branchId: value,
            }
          : {}),
        ...(selectedPartnerType
          ? {
              partnerType: selectedPartnerType,
            }
          : {}),
      }),
    );
  };

  // ==========================================================
  // PARTNER TYPE FILTER CHANGE
  // ==========================================================

  const handlePartnerTypeFilterChange = (event) => {
    const { value } = event.target;

    setSelectedPartnerType(value);

    if (!selectedCompanyId) {
      return;
    }

    dispatch(
      fetchPartners({
        companyId: selectedCompanyId,
        ...(selectedBranchId
          ? {
              branchId: selectedBranchId,
            }
          : {}),
        ...(value
          ? {
              partnerType: value,
            }
          : {}),
      }),
    );
  };

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
  // FORM COMPANY CHANGE
  // ==========================================================

  const handleFormCompanyChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,
      companyId: value,
      branchId: "",
    }));

    if (value) {
      setSelectedCompanyId(value);

      setSelectedBranchId("");
    }
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingPartner(null);
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    resetForm();

    if (selectedCompanyId) {
      setFormData((previous) => ({
        ...previous,
        companyId: selectedCompanyId,
      }));
    }

    if (selectedBranchId) {
      setFormData((previous) => ({
        ...previous,
        companyId: selectedCompanyId,
        branchId: selectedBranchId,
      }));
    }

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (partner) => {
    setSelectedPartner(partner);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (partner) => {
    const companyId =
      typeof partner.companyId === "object"
        ? partner.companyId?._id
        : partner.companyId;

    const branchId =
      typeof partner.branchId === "object"
        ? partner.branchId?._id
        : partner.branchId;

    setEditingPartner(partner);

    setFormData({
      companyId: companyId || "",
      branchId: branchId || "",

      partnerType: partner.partnerType || "CUSTOMER",

      name: partner.name || "",
      code: partner.code || "",
      displayName: partner.displayName || "",

      contactPerson: partner.contactPerson || "",
      mobile: partner.mobile || "",
      alternateMobile: partner.alternateMobile || "",
      email: partner.email || "",
      website: partner.website || "",

      gstin: partner.gstin || "",
      pan: partner.pan || "",

      address: partner.address || "",
      city: partner.city || "",
      state: partner.state || "",
      country: partner.country || "India",
      pincode: partner.pincode || "",

      openingBalance: partner.openingBalance ?? "",
      currentBalance: partner.currentBalance ?? "",
      creditLimit: partner.creditLimit ?? "",
      creditDays: partner.creditDays ?? "",

      status: partner.status || "ACTIVE",
    });

    setSelectedCompanyId(companyId || "");

    setSelectedBranchId(branchId || "");

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (partner) => {
    const result = await dispatch(deletePartner(partner._id));

    if (deletePartner.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Partner Deleted",
        message: "Partner deleted successfully.",
      });

      if (selectedCompanyId) {
        dispatch(
          fetchPartners({
            companyId: selectedCompanyId,
            ...(selectedBranchId
              ? {
                  branchId: selectedBranchId,
                }
              : {}),
            ...(selectedPartnerType
              ? {
                  partnerType: selectedPartnerType,
                }
              : {}),
          }),
        );
      }

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete partner.",
    });
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ----------------------------------------------------------
    // COMPANY REQUIRED
    // ----------------------------------------------------------

    if (!formData.companyId) {
      showToast({
        type: "error",
        title: "Company Required",
        message: "Please select a company.",
      });

      return;
    }

    // ----------------------------------------------------------
    // PARTNER TYPE REQUIRED
    // ----------------------------------------------------------

    if (!formData.partnerType) {
      showToast({
        type: "error",
        title: "Partner Type Required",
        message: "Please select partner type.",
      });

      return;
    }

    // ----------------------------------------------------------
    // NAME REQUIRED
    // ----------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter partner name.",
      });

      return;
    }

    // ----------------------------------------------------------
    // CODE REQUIRED
    // ----------------------------------------------------------

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter partner code.",
      });

      return;
    }

    // ==========================================================
    // PAYLOAD
    // ==========================================================

    const payload = {
      companyId: formData.companyId,

      branchId: formData.branchId || null,

      partnerType: formData.partnerType,

      name: formData.name.trim(),

      code: formData.code.trim().toUpperCase(),

      displayName: formData.displayName?.trim() || null,

      contactPerson: formData.contactPerson?.trim() || null,

      mobile: formData.mobile?.trim() || null,

      alternateMobile: formData.alternateMobile?.trim() || null,

      email: formData.email?.trim().toLowerCase() || null,

      website: formData.website?.trim() || null,

      gstin: formData.gstin?.trim().toUpperCase() || null,

      pan: formData.pan?.trim().toUpperCase() || null,

      address: formData.address?.trim() || null,

      city: formData.city?.trim() || null,

      state: formData.state?.trim() || null,

      country: formData.country?.trim() || "India",

      pincode: formData.pincode?.trim() || null,

      openingBalance:
        formData.openingBalance === "" ? 0 : Number(formData.openingBalance),

      currentBalance:
        formData.currentBalance === "" ? 0 : Number(formData.currentBalance),

      creditLimit:
        formData.creditLimit === "" ? 0 : Number(formData.creditLimit),

      creditDays: formData.creditDays === "" ? 0 : Number(formData.creditDays),

      status: formData.status,
    };

    // ==========================================================
    // UPDATE
    // ==========================================================

    if (editingPartner) {
      const result = await dispatch(
        updatePartner({
          id: editingPartner._id,
          payload,
        }),
      );

      if (updatePartner.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        setSelectedCompanyId(formData.companyId);

        setSelectedBranchId(formData.branchId || "");

        dispatch(
          fetchPartners({
            companyId: formData.companyId,
            ...(formData.branchId
              ? {
                  branchId: formData.branchId,
                }
              : {}),
            ...(formData.partnerType
              ? {
                  partnerType: formData.partnerType,
                }
              : {}),
          }),
        );

        showToast({
          type: "success",
          title: "Partner Updated",
          message: "Partner updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update partner.",
      });

      return;
    }

    // ==========================================================
    // CREATE
    // ==========================================================

    const result = await dispatch(createPartner(payload));

    if (createPartner.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      setSelectedCompanyId(formData.companyId);

      setSelectedBranchId(formData.branchId || "");

      dispatch(
        fetchPartners({
          companyId: formData.companyId,
          ...(formData.branchId
            ? {
                branchId: formData.branchId,
              }
            : {}),
          ...(formData.partnerType
            ? {
                partnerType: formData.partnerType,
              }
            : {}),
        }),
      );

      showToast({
        type: "success",
        title: "Partner Created",
        message: "Partner created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create partner.",
    });
  };

  // ============================================================
  // TABLE COLUMNS
  // ============================================================

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
      key: "partnerType",
      label: "Type",

      render: (row) => row.partnerType || "-",
    },

    {
      key: "companyId",
      label: "Company",

      render: (row) => {
        if (typeof row.companyId === "object") {
          return row.companyId?.name || row.companyId?.code || "-";
        }

        const company = companies.find((item) => item._id === row.companyId);

        return company?.name || company?.code || "-";
      },
    },

    {
      key: "branchId",
      label: "Branch",

      render: (row) => {
        if (!row.branchId) {
          return "-";
        }

        if (typeof row.branchId === "object") {
          return row.branchId?.name || row.branchId?.code || "-";
        }

        const branch = branches.find((item) => item._id === row.branchId);

        return branch?.name || branch?.code || "-";
      },
    },

    {
      key: "mobile",
      label: "Mobile",

      render: (row) => row.mobile || "-",
    },

    {
      key: "gstin",
      label: "GSTIN",

      render: (row) => row.gstin || "-",
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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section>
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        title="Partners"
        description="Manage customers and suppliers."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Partner
          </Button>
        }
      />

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <Grid>
        <Select
          label="Company"
          name="selectedCompanyId"
          value={selectedCompanyId}
          onChange={handleCompanyFilterChange}
          options={companyOptions}
        />

        <Select
          label="Branch"
          name="selectedBranchId"
          value={selectedBranchId}
          onChange={handleBranchFilterChange}
          options={branchOptions}
        />

        <Select
          label="Partner Type"
          name="selectedPartnerType"
          value={selectedPartnerType}
          onChange={handlePartnerTypeFilterChange}
          options={[
            {
              value: "",
              label: "All Types",
            },
            ...partnerTypeOptions,
          ]}
        />
      </Grid>

      {/* ======================================================
          PARTNER TABLE
      ====================================================== */}

      <Table
        title="Partners"
        columns={columns}
        data={partners}
        rowKey="_id"
        emptyMessage={
          selectedCompanyId ? "No partners found." : "Please select a company."
        }
        loading={status === "loading"}
        searchPlaceholder="Search partners..."
      />

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          resetForm();
        }}
        title={editingPartner ? "Edit Partner" : "Add Partner"}
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

            <Button type="submit" form="partner-form">
              {editingPartner ? "Update Partner" : "Create Partner"}
            </Button>
          </>
        }
      >
        <form id="partner-form" onSubmit={handleSubmit}>
          <Grid>
            {/* ==================================================
                COMPANY
            ================================================== */}

            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleFormCompanyChange}
              options={companyOptions}
            />

            {/* ==================================================
                BRANCH
            ================================================== */}

            <Select
              label="Branch"
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "No Branch",
                },
                ...branchOptions,
              ]}
            />

            {/* ==================================================
                PARTNER TYPE
            ================================================== */}

            <Select
              label="Partner Type"
              name="partnerType"
              value={formData.partnerType}
              onChange={handleChange}
              options={partnerTypeOptions}
            />

            {/* ==================================================
                NAME
            ================================================== */}

            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter partner name"
            />

            {/* ==================================================
                CODE
            ================================================== */}

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter partner code"
            />

            {/* ==================================================
                DISPLAY NAME
            ================================================== */}

            <Input
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter display name"
            />

            {/* ==================================================
                CONTACT PERSON
            ================================================== */}

            <Input
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Enter contact person"
            />

            {/* ==================================================
                MOBILE
            ================================================== */}

            <Input
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />

            {/* ==================================================
                ALTERNATE MOBILE
            ================================================== */}

            <Input
              label="Alternate Mobile"
              name="alternateMobile"
              value={formData.alternateMobile}
              onChange={handleChange}
              placeholder="Enter alternate mobile"
            />

            {/* ==================================================
                EMAIL
            ================================================== */}

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            {/* ==================================================
                WEBSITE
            ================================================== */}

            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website"
            />

            {/* ==================================================
                GSTIN
            ================================================== */}

            <Input
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="Enter GSTIN"
            />

            {/* ==================================================
                PAN
            ================================================== */}

            <Input
              label="PAN"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              placeholder="Enter PAN"
            />

            {/* ==================================================
                ADDRESS
            ================================================== */}

            <Textarea
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />

            {/* ==================================================
                CITY
            ================================================== */}

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            {/* ==================================================
                STATE
            ================================================== */}

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

            {/* ==================================================
                COUNTRY
            ================================================== */}

            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />

            {/* ==================================================
                PINCODE
            ================================================== */}

            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />

            {/* ==================================================
                OPENING BALANCE
            ================================================== */}

            <Input
              label="Opening Balance"
              name="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="Enter opening balance"
            />

            {/* ==================================================
                CURRENT BALANCE
            ================================================== */}

            <Input
              label="Current Balance"
              name="currentBalance"
              type="number"
              value={formData.currentBalance}
              onChange={handleChange}
              placeholder="Enter current balance"
            />

            {/* ==================================================
                CREDIT LIMIT
            ================================================== */}

            <Input
              label="Credit Limit"
              name="creditLimit"
              type="number"
              value={formData.creditLimit}
              onChange={handleChange}
              placeholder="Enter credit limit"
            />

            {/* ==================================================
                CREDIT DAYS
            ================================================== */}

            <Input
              label="Credit Days"
              name="creditDays"
              type="number"
              value={formData.creditDays}
              onChange={handleChange}
              placeholder="Enter credit days"
            />

            {/* ==================================================
                STATUS
            ================================================== */}

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

      {/* ======================================================
          VIEW PARTNER MODAL
      ====================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedPartner(null);
        }}
        title="View Partner"
      >
        {selectedPartner && (
          <Grid columns={1}>
            {/* ==================================================
                COMPANY
            ================================================== */}

            <div>
              <strong>Company</strong>

              <div>
                {typeof selectedPartner.companyId === "object"
                  ? selectedPartner.companyId?.name ||
                    selectedPartner.companyId?.code ||
                    "-"
                  : companies.find(
                      (company) => company._id === selectedPartner.companyId,
                    )?.name || "-"}
              </div>
            </div>

            {/* ==================================================
                BRANCH
            ================================================== */}

            <div>
              <strong>Branch</strong>

              <div>
                {!selectedPartner.branchId
                  ? "-"
                  : typeof selectedPartner.branchId === "object"
                    ? selectedPartner.branchId?.name ||
                      selectedPartner.branchId?.code ||
                      "-"
                    : branches.find(
                        (branch) => branch._id === selectedPartner.branchId,
                      )?.name || "-"}
              </div>
            </div>

            {/* ==================================================
                PARTNER TYPE
            ================================================== */}

            <div>
              <strong>Partner Type</strong>

              <div>{selectedPartner.partnerType || "-"}</div>
            </div>

            {/* ==================================================
                NAME
            ================================================== */}

            <div>
              <strong>Name</strong>

              <div>{selectedPartner.name || "-"}</div>
            </div>

            {/* ==================================================
                CODE
            ================================================== */}

            <div>
              <strong>Code</strong>

              <div>{selectedPartner.code || "-"}</div>
            </div>

            {/* ==================================================
                DISPLAY NAME
            ================================================== */}

            <div>
              <strong>Display Name</strong>

              <div>{selectedPartner.displayName || "-"}</div>
            </div>

            {/* ==================================================
                CONTACT PERSON
            ================================================== */}

            <div>
              <strong>Contact Person</strong>

              <div>{selectedPartner.contactPerson || "-"}</div>
            </div>

            {/* ==================================================
                MOBILE
            ================================================== */}

            <div>
              <strong>Mobile</strong>

              <div>{selectedPartner.mobile || "-"}</div>
            </div>

            {/* ==================================================
                ALTERNATE MOBILE
            ================================================== */}

            <div>
              <strong>Alternate Mobile</strong>

              <div>{selectedPartner.alternateMobile || "-"}</div>
            </div>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>
              <strong>Email</strong>

              <div>{selectedPartner.email || "-"}</div>
            </div>

            {/* ==================================================
                WEBSITE
            ================================================== */}

            <div>
              <strong>Website</strong>

              <div>{selectedPartner.website || "-"}</div>
            </div>

            {/* ==================================================
                GSTIN
            ================================================== */}

            <div>
              <strong>GSTIN</strong>

              <div>{selectedPartner.gstin || "-"}</div>
            </div>

            {/* ==================================================
                PAN
            ================================================== */}

            <div>
              <strong>PAN</strong>

              <div>{selectedPartner.pan || "-"}</div>
            </div>

            {/* ==================================================
                ADDRESS
            ================================================== */}

            <div>
              <strong>Address</strong>

              <div>{selectedPartner.address || "-"}</div>
            </div>

            {/* ==================================================
                CITY
            ================================================== */}

            <div>
              <strong>City</strong>

              <div>{selectedPartner.city || "-"}</div>
            </div>

            {/* ==================================================
                STATE
            ================================================== */}

            <div>
              <strong>State</strong>

              <div>{selectedPartner.state || "-"}</div>
            </div>

            {/* ==================================================
                COUNTRY
            ================================================== */}

            <div>
              <strong>Country</strong>

              <div>{selectedPartner.country || "-"}</div>
            </div>

            {/* ==================================================
                PINCODE
            ================================================== */}

            <div>
              <strong>Pincode</strong>

              <div>{selectedPartner.pincode || "-"}</div>
            </div>

            {/* ==================================================
                OPENING BALANCE
            ================================================== */}

            <div>
              <strong>Opening Balance</strong>

              <div>{selectedPartner.openingBalance ?? 0}</div>
            </div>

            {/* ==================================================
                CURRENT BALANCE
            ================================================== */}

            <div>
              <strong>Current Balance</strong>

              <div>{selectedPartner.currentBalance ?? 0}</div>
            </div>

            {/* ==================================================
                CREDIT LIMIT
            ================================================== */}

            <div>
              <strong>Credit Limit</strong>

              <div>{selectedPartner.creditLimit ?? 0}</div>
            </div>

            {/* ==================================================
                CREDIT DAYS
            ================================================== */}

            <div>
              <strong>Credit Days</strong>

              <div>{selectedPartner.creditDays ?? 0}</div>
            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedPartner.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default PartnerPage;
