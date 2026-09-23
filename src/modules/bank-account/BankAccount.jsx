import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select, Textarea } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import { DeleteIcon, EditIcon, ViewIcon } from "../../components/common/icons";

// ============================================================
// TOAST
// ============================================================

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

// ============================================================
// BANK ACCOUNT THUNKS / SELECTORS
// ============================================================

import {
  fetchBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from "./store/bank-account.thunks.js";

import {
  selectBankAccounts,
  selectBankAccountStatus,
  selectSelectedBankAccount,
} from "./store/bank-account.selectors.js";

// ============================================================
// COMPANY
// ============================================================

import { fetchCompanies } from "../company/store/company.thunks.js";

import {
  selectCompanies,
  selectCompanyStatus,
} from "../company/store/company.selectors.js";

// ============================================================
// BRANCH
// ============================================================

import { fetchBranches } from "../branch/store/branch.thunks.js";

import {
  selectBranches,
  selectBranchStatus,
} from "../branch/store/branch.selectors.js";

// ============================================================
// BANK
// ============================================================

import { fetchBanks } from "../bank/store/bank.thunks.js";

import { selectBanks, selectBankStatus } from "../bank/store/bank.selectors.js";

// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  bankId: "",

  accountName: "",
  accountNumber: "",
  accountType: "CURRENT",

  ifscCode: "",
  branchName: "",
  upiId: "",

  openingBalance: 0,
  currentBalance: 0,

  isDefault: false,
  status: "ACTIVE",
};

// ============================================================
// COMPONENT
// ============================================================

function BankAccount() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // BANK ACCOUNT REDUX STATE
  // ==========================================================

  const bankAccounts = useSelector(selectBankAccounts);

  const bankAccountStatus = useSelector(selectBankAccountStatus);

  const selectedBankAccount = useSelector(selectSelectedBankAccount);

  // ==========================================================
  // COMPANY REDUX STATE
  // ==========================================================

  const companies = useSelector(selectCompanies);

  const companyStatus = useSelector(selectCompanyStatus);

  // ==========================================================
  // BRANCH REDUX STATE
  // ==========================================================

  const branches = useSelector(selectBranches);

  const branchStatus = useSelector(selectBranchStatus);

  // ==========================================================
  // BANK REDUX STATE
  // ==========================================================

  const banks = useSelector(selectBanks);

  const bankStatus = useSelector(selectBankStatus);

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [viewBankAccount, setViewBankAccount] = useState(null);

  const [editingBankAccount, setEditingBankAccount] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // INITIAL DATA FETCH
  // ==========================================================

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchBanks());
    dispatch(fetchBankAccounts());
  }, [dispatch]);

  // ==========================================================
  // FETCH BRANCHES WHEN COMPANY CHANGES
  // ==========================================================

  useEffect(() => {
    if (!formData.companyId) {
      return;
    }

    dispatch(fetchBranches(formData.companyId));
  }, [dispatch, formData.companyId]);

  // ==========================================================
  // FILTER BRANCHES
  // ==========================================================

  const filteredBranches = useMemo(() => {
    if (!formData.companyId) {
      return [];
    }

    return branches.filter((branch) => {
      const branchCompanyId = branch.companyId?._id || branch.companyId;

      return String(branchCompanyId) === String(formData.companyId);
    });
  }, [branches, formData.companyId]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => {
      const next = {
        ...previous,
        [name]: type === "checkbox" ? checked : value,
      };

      // ------------------------------------------------------
      // COMPANY CHANGED
      // ------------------------------------------------------

      if (name === "companyId") {
        next.branchId = "";
      }

      return next;
    });
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingBankAccount(null);
  };

  // ==========================================================
  // OPEN CREATE
  // ==========================================================

  const handleCreate = () => {
    resetForm();

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (bankAccount) => {
    setViewBankAccount(bankAccount);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (bankAccount) => {
    const companyId = bankAccount.companyId?._id || bankAccount.companyId || "";

    const branchId = bankAccount.branchId?._id || bankAccount.branchId || "";

    const bankId = bankAccount.bankId?._id || bankAccount.bankId || "";

    setEditingBankAccount(bankAccount);

    setFormData({
      companyId,

      branchId,

      bankId,

      accountName: bankAccount.accountName || "",

      accountNumber: bankAccount.accountNumber || "",

      accountType: bankAccount.accountType || "CURRENT",

      ifscCode: bankAccount.ifscCode || "",

      branchName: bankAccount.branchName || "",

      upiId: bankAccount.upiId || "",

      openingBalance: bankAccount.openingBalance ?? 0,

      currentBalance: bankAccount.currentBalance ?? 0,

      isDefault: Boolean(bankAccount.isDefault),

      status: bankAccount.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (bankAccount) => {
    const result = await dispatch(deleteBankAccount(bankAccount._id));

    if (deleteBankAccount.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Bank Account Deleted",
        message: "Bank account deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete bank account.",
    });
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {
    if (!formData.companyId) {
      showToast({
        type: "error",
        title: "Company Required",
        message: "Please select a company.",
      });

      return false;
    }

    if (!formData.branchId) {
      showToast({
        type: "error",
        title: "Branch Required",
        message: "Please select a branch.",
      });

      return false;
    }

    if (!formData.bankId) {
      showToast({
        type: "error",
        title: "Bank Required",
        message: "Please select a bank.",
      });

      return false;
    }

    if (!formData.accountName.trim()) {
      showToast({
        type: "error",
        title: "Account Name Required",
        message: "Please enter account name.",
      });

      return false;
    }

    if (!formData.accountNumber.trim()) {
      showToast({
        type: "error",
        title: "Account Number Required",
        message: "Please enter account number.",
      });

      return false;
    }

    if (!formData.ifscCode.trim()) {
      showToast({
        type: "error",
        title: "IFSC Required",
        message: "Please enter IFSC code.",
      });

      return false;
    }

    return true;
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    const payload = {
      companyId: formData.companyId,

      branchId: formData.branchId,

      // IMPORTANT:
      // Backend requires this field.
      bankId: formData.bankId,

      accountName: formData.accountName.trim(),

      accountNumber: formData.accountNumber.trim(),

      accountType: formData.accountType,

      ifscCode: formData.ifscCode.trim().toUpperCase(),

      branchName: formData.branchName.trim() || null,

      upiId: formData.upiId.trim().toLowerCase() || null,

      openingBalance: Number(formData.openingBalance) || 0,

      currentBalance: Number(formData.currentBalance) || 0,

      isDefault: Boolean(formData.isDefault),

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingBankAccount) {
      const result = await dispatch(
        updateBankAccount({
          id: editingBankAccount._id,

          payload,
        }),
      );

      if (updateBankAccount.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        dispatch(fetchBankAccounts());

        showToast({
          type: "success",
          title: "Bank Account Updated",
          message: "Bank account updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update bank account.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createBankAccount(payload));

    if (createBankAccount.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      dispatch(fetchBankAccounts());

      showToast({
        type: "success",
        title: "Bank Account Created",
        message: "Bank account created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create bank account.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "accountName",

      label: "Account Name",
    },

    {
      key: "accountNumber",

      label: "Account Number",

      render: (row) => row.accountNumber || "-",
    },

    {
      key: "bankId",

      label: "Bank",

      render: (row) => row.bankId?.name || row.bankId?.bankName || "-",
    },

    {
      key: "companyId",

      label: "Company",

      render: (row) => row.companyId?.name || "-",
    },

    {
      key: "branchId",

      label: "Branch",

      render: (row) => row.branchId?.name || "-",
    },

    {
      key: "accountType",

      label: "Account Type",

      render: (row) => row.accountType || "-",
    },

    {
      key: "ifscCode",

      label: "IFSC",

      render: (row) => row.ifscCode || "-",
    },

    {
      key: "currentBalance",

      label: "Balance",

      render: (row) => row.currentBalance ?? 0,
    },

    {
      key: "status",

      label: "Status",

      render: (row) => <Badge>{row.status}</Badge>,
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
        title="Bank Accounts"
        description="Manage company bank accounts."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Bank Account
          </Button>
        }
      />

      {/* ====================================================
          BANK ACCOUNT TABLE
      ==================================================== */}

      <Table
        title="Bank Accounts"
        columns={columns}
        data={bankAccounts}
        rowKey="_id"
        emptyMessage="No bank accounts found."
        loading={bankAccountStatus === "loading"}
        searchPlaceholder="Search bank accounts..."
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
        title={editingBankAccount ? "Edit Bank Account" : "Add Bank Account"}
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

            <Button type="submit" form="bank-account-form">
              {editingBankAccount
                ? "Update Bank Account"
                : "Create Bank Account"}
            </Button>
          </>
        }
      >
        <form id="bank-account-form" onSubmit={handleSubmit}>
          <Grid>
            {/* ==================================================
                COMPANY
            ================================================== */}

            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Company",
                },

                ...companies.map((company) => ({
                  value: company._id,

                  label: `${company.name}${
                    company.code ? ` (${company.code})` : ""
                  }`,
                })),
              ]}
            />

            {/* ==================================================
                BRANCH
            ================================================== */}

            <Select
              label="Branch"
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              disabled={!formData.companyId || branchStatus === "loading"}
              options={[
                {
                  value: "",
                  label: formData.companyId
                    ? "Select Branch"
                    : "Select Company First",
                },

                ...filteredBranches.map((branch) => ({
                  value: branch._id,

                  label: `${branch.name}${
                    branch.code ? ` (${branch.code})` : ""
                  }`,
                })),
              ]}
            />

            {/* ==================================================
                BANK
            ================================================== */}

            <Select
              label="Bank"
              name="bankId"
              value={formData.bankId}
              onChange={handleChange}
              disabled={bankStatus === "loading"}
              options={[
                {
                  value: "",
                  label: "Select Bank",
                },

                ...banks.map((bank) => ({
                  value: bank._id,

                  label: `${bank.name}${bank.code ? ` (${bank.code})` : ""}`,
                })),
              ]}
            />

            {/* ==================================================
                ACCOUNT NAME
            ================================================== */}

            <Input
              label="Account Name"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Enter account name"
            />

            {/* ==================================================
                ACCOUNT NUMBER
            ================================================== */}

            <Input
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
            />

            {/* ==================================================
                ACCOUNT TYPE
            ================================================== */}

            <Select
              label="Account Type"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              options={[
                {
                  value: "CURRENT",
                  label: "Current",
                },

                {
                  value: "SAVINGS",
                  label: "Savings",
                },

                {
                  value: "OD",
                  label: "Overdraft",
                },

                {
                  value: "CC",
                  label: "Cash Credit",
                },

                {
                  value: "OTHER",
                  label: "Other",
                },
              ]}
            />

            {/* ==================================================
                IFSC
            ================================================== */}

            <Input
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="Enter IFSC code"
            />

            {/* ==================================================
                BANK BRANCH NAME
            ================================================== */}

            <Input
              label="Bank Branch Name"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              placeholder="Enter bank branch name"
            />

            {/* ==================================================
                UPI
            ================================================== */}

            <Input
              label="UPI ID"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="Enter UPI ID"
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

            {/* ==================================================
                DEFAULT ACCOUNT
            ================================================== */}

            <Select
              label="Default Account"
              name="isDefault"
              value={formData.isDefault ? "true" : "false"}
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,

                  isDefault: event.target.value === "true",
                }));
              }}
              options={[
                {
                  value: "false",
                  label: "No",
                },

                {
                  value: "true",
                  label: "Yes",
                },
              ]}
            />

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <Textarea
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setViewBankAccount(null);
        }}
        title="View Bank Account"
      >
        {viewBankAccount && (
          <Grid columns={1}>
            {/* COMPANY */}

            <div>
              <strong>Company</strong>

              <div>{viewBankAccount.companyId?.name || "-"}</div>
            </div>

            {/* BRANCH */}

            <div>
              <strong>Branch</strong>

              <div>{viewBankAccount.branchId?.name || "-"}</div>
            </div>

            {/* BANK */}

            <div>
              <strong>Bank</strong>

              <div>
                {viewBankAccount.bankId?.name ||
                  viewBankAccount.bankId?.bankName ||
                  "-"}
              </div>
            </div>

            {/* ACCOUNT NAME */}

            <div>
              <strong>Account Name</strong>

              <div>{viewBankAccount.accountName || "-"}</div>
            </div>

            {/* ACCOUNT NUMBER */}

            <div>
              <strong>Account Number</strong>

              <div>{viewBankAccount.accountNumber || "-"}</div>
            </div>

            {/* ACCOUNT TYPE */}

            <div>
              <strong>Account Type</strong>

              <div>{viewBankAccount.accountType || "-"}</div>
            </div>

            {/* IFSC */}

            <div>
              <strong>IFSC Code</strong>

              <div>{viewBankAccount.ifscCode || "-"}</div>
            </div>

            {/* BANK BRANCH */}

            <div>
              <strong>Bank Branch Name</strong>

              <div>{viewBankAccount.branchName || "-"}</div>
            </div>

            {/* UPI */}

            <div>
              <strong>UPI ID</strong>

              <div>{viewBankAccount.upiId || "-"}</div>
            </div>

            {/* OPENING BALANCE */}

            <div>
              <strong>Opening Balance</strong>

              <div>{viewBankAccount.openingBalance ?? 0}</div>
            </div>

            {/* CURRENT BALANCE */}

            <div>
              <strong>Current Balance</strong>

              <div>{viewBankAccount.currentBalance ?? 0}</div>
            </div>

            {/* DEFAULT */}

            <div>
              <strong>Default Account</strong>

              <div>{viewBankAccount.isDefault ? "Yes" : "No"}</div>
            </div>

            {/* STATUS */}

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{viewBankAccount.status}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default BankAccount;
