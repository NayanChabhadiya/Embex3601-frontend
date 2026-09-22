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
  fetchPurchaseCompanies,
  createPurchaseCompany,
  updatePurchaseCompany,
  deletePurchaseCompany,
} from "./store/purchase-company.thunks.js";

import {
  selectPurchaseCompanies,
  selectPurchaseCompanyStatus,
} from "./store/purchase-company.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

import { fetchPartnerCategories } from "../partner-category/store/partner-category.thunks.js";

import { selectPartnerCategories } from "../partner-category/store/partner-category.selectors.js";

import { fetchPaymentTerms } from "../payment-term/store/payment-term.thunks.js";

import { selectPaymentTerms } from "../payment-term/store/payment-term.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  name: "",
  code: "",
  displayName: "",

  contactPerson: "",
  email: "",
  mobile: "",
  phone: "",

  gstin: "",
  pan: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  partnerCategoryId: "",
  paymentTermId: "",

  creditLimit: 0,
  openingBalance: 0,

  status: "ACTIVE",
};

// ============================================================
// PAGE
// ============================================================

function PurchaseCompanyPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // PURCHASE COMPANY REDUX STATE
  // ==========================================================

  const purchaseCompanies = useSelector(selectPurchaseCompanies);

  const status = useSelector(selectPurchaseCompanyStatus);

  const purchasec = useSelector((state) => state.purchaseCompanies);
  console.log(purchasec)
  // ==========================================================
  // ACTIVE WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // PARTNER CATEGORIES
  // ==========================================================

  const partnerCategories = useSelector(selectPartnerCategories);

  // ==========================================================
  // PAYMENT TERMS
  // ==========================================================

  const paymentTerms = useSelector(selectPaymentTerms);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING PURCHASE COMPANY
  // ==========================================================

  const [selectedPurchaseCompany, setSelectedPurchaseCompany] = useState(null);

  const [editingPurchaseCompany, setEditingPurchaseCompany] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH PURCHASE COMPANIES
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(fetchPurchaseCompanies(selectedWorkspace._id));
  }, [dispatch, selectedWorkspace?._id]);

  // ==========================================================
  // FETCH PARTNER CATEGORIES
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(fetchPartnerCategories(selectedWorkspace._id));
  }, [dispatch, selectedWorkspace?._id]);

  // ==========================================================
  // FETCH PAYMENT TERMS
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(fetchPaymentTerms(selectedWorkspace._id));
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

    setEditingPurchaseCompany(null);
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

  const handleView = (purchaseCompany) => {
    setSelectedPurchaseCompany(purchaseCompany);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (purchaseCompany) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingPurchaseCompany(purchaseCompany);

    setFormData({
      name: purchaseCompany.name || "",

      code: purchaseCompany.code || "",

      displayName: purchaseCompany.displayName || "",

      contactPerson: purchaseCompany.contactPerson || "",

      email: purchaseCompany.email || "",

      mobile: purchaseCompany.mobile || "",

      phone: purchaseCompany.phone || "",

      gstin: purchaseCompany.gstin || "",

      pan: purchaseCompany.pan || "",

      addressLine1: purchaseCompany.addressLine1 || "",

      addressLine2: purchaseCompany.addressLine2 || "",

      city: purchaseCompany.city || "",

      state: purchaseCompany.state || "",

      country: purchaseCompany.country || "India",

      pincode: purchaseCompany.pincode || "",

      partnerCategoryId:
        purchaseCompany.partnerCategoryId?._id ||
        purchaseCompany.partnerCategoryId ||
        "",

      paymentTermId:
        purchaseCompany.paymentTermId?._id ||
        purchaseCompany.paymentTermId ||
        "",

      creditLimit: purchaseCompany.creditLimit ?? 0,

      openingBalance: purchaseCompany.openingBalance ?? 0,

      status: purchaseCompany.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (purchaseCompany) => {
    const result = await dispatch(deletePurchaseCompany(purchaseCompany._id));

    if (deletePurchaseCompany.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Purchase Company Deleted",
        message: "Purchase company deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete purchase company.",
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
        message: "Please enter purchase company name.",
      });

      return;
    }

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter purchase company code.",
      });

      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      workspaceId: selectedWorkspace._id,

      name: formData.name.trim(),

      code: formData.code.trim().toUpperCase(),

      displayName: formData.displayName?.trim() || "",

      contactPerson: formData.contactPerson?.trim() || "",

      email: formData.email?.trim().toLowerCase() || "",

      mobile: formData.mobile?.trim() || "",

      phone: formData.phone?.trim() || "",

      gstin: formData.gstin?.trim().toUpperCase() || "",

      pan: formData.pan?.trim().toUpperCase() || "",

      addressLine1: formData.addressLine1?.trim() || "",

      addressLine2: formData.addressLine2?.trim() || "",

      city: formData.city?.trim() || "",

      state: formData.state?.trim() || "",

      country: formData.country?.trim() || "India",

      pincode: formData.pincode?.trim() || "",

      partnerCategoryId: formData.partnerCategoryId || null,

      paymentTermId: formData.paymentTermId || null,

      creditLimit: Number(formData.creditLimit) || 0,

      openingBalance: Number(formData.openingBalance) || 0,

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingPurchaseCompany) {
      const result = await dispatch(
        updatePurchaseCompany({
          id: editingPurchaseCompany._id,
          payload,
        }),
      );

      if (updatePurchaseCompany.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Purchase Company Updated",
          message: "Purchase company updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update purchase company.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createPurchaseCompany(payload));

    if (createPurchaseCompany.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Purchase Company Created",
        message: "Purchase company created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create purchase company.",
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
      key: "gstin",
      label: "GSTIN",

      render: (row) => row.gstin || "-",
    },

    {
      key: "contactPerson",
      label: "Contact Person",

      render: (row) => row.contactPerson || "-",
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
  // PARTNER CATEGORY OPTIONS
  // ==========================================================

  const partnerCategoryOptions = partnerCategories.map((category) => ({
    value: category._id,

    label: category.name || category.code || "-",
  }));

  // ==========================================================
  // PAYMENT TERM OPTIONS
  // ==========================================================

  const paymentTermOptions = paymentTerms.map((paymentTerm) => ({
    value: paymentTerm._id,

    label: paymentTerm.name || paymentTerm.code || "-",
  }));

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section>
      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <PageHeader
        title="Purchase Companies"
        description="Manage workspace purchase companies."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Purchase Company
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
          PURCHASE COMPANY TABLE
      ==================================================== */}

      <Table
        title="Purchase Companies"
        columns={columns}
        data={purchaseCompanies}
        rowKey="_id"
        emptyMessage="No purchase companies found."
        loading={status === "loading"}
        searchPlaceholder="Search purchase companies..."
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
        title={
          editingPurchaseCompany
            ? "Edit Purchase Company"
            : "Add Purchase Company"
        }
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

            <Button type="submit" form="purchase-company-form">
              {editingPurchaseCompany
                ? "Update Purchase Company"
                : "Create Purchase Company"}
            </Button>
          </>
        }
      >
        <form id="purchase-company-form" onSubmit={handleSubmit}>
          <Grid>
            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter purchase company name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter purchase company code"
            />

            <Input
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter display name"
            />

            {/* ==================================================
                CONTACT INFORMATION
            ================================================== */}

            <Input
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Enter contact person"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />

            <Input
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            {/* ==================================================
                TAX INFORMATION
            ================================================== */}

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

            {/* ==================================================
                ADDRESS
            ================================================== */}

            <Textarea
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Enter address line 1"
            />

            <Textarea
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

            {/* ==================================================
                PARTNER CATEGORY
            ================================================== */}

            <Select
              label="Partner Category"
              name="partnerCategoryId"
              value={formData.partnerCategoryId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Partner Category",
                },
                ...partnerCategoryOptions,
              ]}
            />

            {/* ==================================================
                PAYMENT TERM
            ================================================== */}

            <Select
              label="Payment Term"
              name="paymentTermId"
              value={formData.paymentTermId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Payment Term",
                },
                ...paymentTermOptions,
              ]}
            />

            {/* ==================================================
                PAYMENT / CREDIT
            ================================================== */}

            <Input
              label="Credit Limit"
              name="creditLimit"
              type="number"
              min="0"
              value={formData.creditLimit}
              onChange={handleChange}
              placeholder="Enter credit limit"
            />

            <Input
              label="Opening Balance"
              name="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="Enter opening balance"
            />

            {/* ==================================================
                STATUS
            ================================================== */}

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                {
                  value: "ACTIVE",
                  label: "Active",
                },
                {
                  value: "INACTIVE",
                  label: "Inactive",
                },
              ]}
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW PURCHASE COMPANY MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedPurchaseCompany(null);
        }}
        title="View Purchase Company"
      >
        {selectedPurchaseCompany && (
          <Grid columns={1}>
            <div>
              <strong>Name</strong>

              <div>{selectedPurchaseCompany.name || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{selectedPurchaseCompany.code || "-"}</div>
            </div>

            <div>
              <strong>Display Name</strong>

              <div>{selectedPurchaseCompany.displayName || "-"}</div>
            </div>

            <div>
              <strong>Contact Person</strong>

              <div>{selectedPurchaseCompany.contactPerson || "-"}</div>
            </div>

            <div>
              <strong>Email</strong>

              <div>{selectedPurchaseCompany.email || "-"}</div>
            </div>

            <div>
              <strong>Mobile</strong>

              <div>{selectedPurchaseCompany.mobile || "-"}</div>
            </div>

            <div>
              <strong>Phone</strong>

              <div>{selectedPurchaseCompany.phone || "-"}</div>
            </div>

            <div>
              <strong>GSTIN</strong>

              <div>{selectedPurchaseCompany.gstin || "-"}</div>
            </div>

            <div>
              <strong>PAN</strong>

              <div>{selectedPurchaseCompany.pan || "-"}</div>
            </div>

            <div>
              <strong>Address Line 1</strong>

              <div>{selectedPurchaseCompany.addressLine1 || "-"}</div>
            </div>

            <div>
              <strong>Address Line 2</strong>

              <div>{selectedPurchaseCompany.addressLine2 || "-"}</div>
            </div>

            <div>
              <strong>City</strong>

              <div>{selectedPurchaseCompany.city || "-"}</div>
            </div>

            <div>
              <strong>State</strong>

              <div>{selectedPurchaseCompany.state || "-"}</div>
            </div>

            <div>
              <strong>Country</strong>

              <div>{selectedPurchaseCompany.country || "-"}</div>
            </div>

            <div>
              <strong>Pincode</strong>

              <div>{selectedPurchaseCompany.pincode || "-"}</div>
            </div>

            <div>
              <strong>Partner Category</strong>

              <div>
                {selectedPurchaseCompany.partnerCategoryId?.name ||
                  selectedPurchaseCompany.partnerCategoryId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Payment Term</strong>

              <div>
                {selectedPurchaseCompany.paymentTermId?.name ||
                  selectedPurchaseCompany.paymentTermId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Credit Limit</strong>

              <div>{selectedPurchaseCompany.creditLimit ?? 0}</div>
            </div>

            <div>
              <strong>Opening Balance</strong>

              <div>{selectedPurchaseCompany.openingBalance ?? 0}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedPurchaseCompany.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default PurchaseCompanyPage;
