import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../components/common/icons/index.js";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

import {
  fetchCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "./store/currency.thunks.js";

import {
  selectCurrencies,
  selectCurrencyStatus,
} from "./store/currency.selectors.js";

function CurrencyPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // REDUX STATE
  // ==========================================================

  const currencies = useSelector(selectCurrencies);

  const status = useSelector(selectCurrencyStatus);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING CURRENCY
  // ==========================================================

  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [editingCurrency, setEditingCurrency] = useState(null);

  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    symbol: "",
    decimalPlaces: "2",
    status: "ACTIVE",
  });

  // ==========================================================
  // FETCH CURRENCIES
  // ==========================================================

  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);

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
    setFormData({
      name: "",
      code: "",
      symbol: "",
      decimalPlaces: "2",
      status: "ACTIVE",
    });

    setEditingCurrency(null);
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    resetForm();

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (currency) => {
    setSelectedCurrency(currency);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (currency) => {
    setEditingCurrency(currency);

    setFormData({
      name: currency.name || "",
      code: currency.code || "",
      symbol: currency.symbol || "",
      decimalPlaces:
        currency.decimalPlaces !== undefined && currency.decimalPlaces !== null
          ? String(currency.decimalPlaces)
          : "2",
      status: currency.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (currency) => {
    const result = await dispatch(deleteCurrency(currency._id));

    if (deleteCurrency.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Currency Deleted",
        message: "Currency deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete currency.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      symbol: formData.symbol,
      decimalPlaces: Number(formData.decimalPlaces),
      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingCurrency) {
      const result = await dispatch(
        updateCurrency({
          id: editingCurrency._id,
          payload,
        }),
      );

      if (updateCurrency.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Currency Updated",
          message: "Currency updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update currency.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createCurrency(payload));

    if (createCurrency.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Currency Created",
        message: "Currency created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create currency.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
    },

    {
      key: "name",
      label: "Name",
    },

    {
      key: "code",
      label: "Code",
    },

    {
      key: "symbol",
      label: "Symbol",
    },

    {
      key: "decimalPlaces",
      label: "Decimal Places",
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
          <ViewIcon size={5} onClick={() => handleView(row)} title="View" />

          <EditIcon size={5} onClick={() => handleEdit(row)} title="Edit" />

          <DeleteIcon
            size={5}
            onClick={() => handleDelete(row)}
            title="Delete"
          />
        </>
      ),
    },
  ];

  return (
    <section>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        title="Currencies"
        description="Manage currencies used across your workspace."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Currency
          </Button>
        }
      />

      {/* =====================================================
          CURRENCY TABLE
      ===================================================== */}

      <Table
        title="Currencies"
        columns={columns}
        data={currencies}
        rowKey="_id"
        emptyMessage="No currencies found."
        loading={status === "loading"}
        searchPlaceholder="Search currencies..."
      />

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          resetForm();
        }}
        title={editingCurrency ? "Edit Currency" : "Add Currency"}
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

            <Button type="submit" form="currency-form">
              {editingCurrency ? "Update Currency" : "Create Currency"}
            </Button>
          </>
        }
      >
        <form id="currency-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Currency Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter currency name"
            />

            <Input
              label="Currency Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter currency code"
              maxLength={3}
            />

            <Input
              label="Currency Symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="Enter currency symbol"
            />

            <Input
              label="Decimal Places"
              name="decimalPlaces"
              type="number"
              value={formData.decimalPlaces}
              onChange={handleChange}
              placeholder="Enter decimal places"
              min="0"
              max="6"
            />

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

      {/* =====================================================
          VIEW CURRENCY MODAL
      ===================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedCurrency(null);
        }}
        title="View Currency"
      >
        {selectedCurrency && (
          <Grid columns={1}>
            <div>
              <strong>Currency Name</strong>

              <div>{selectedCurrency.name || "-"}</div>
            </div>

            <div>
              <strong>Currency Code</strong>

              <div>{selectedCurrency.code || "-"}</div>
            </div>

            <div>
              <strong>Currency Symbol</strong>

              <div>{selectedCurrency.symbol || "-"}</div>
            </div>

            <div>
              <strong>Decimal Places</strong>

              <div>{selectedCurrency.decimalPlaces ?? "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedCurrency.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Created At</strong>

              <div>
                {selectedCurrency.createdAt
                  ? new Date(selectedCurrency.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default CurrencyPage;
