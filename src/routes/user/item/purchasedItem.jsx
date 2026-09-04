import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { useEffect, useState } from "react";
import {
  addPurchasedItem,
  deletePurchasedItem,
  getPurchasedItemsByUser,
  updatePurchasedItem,
} from "../../../store/apiSlice/purchasedItemSlice";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import DataTable from "../../../components/datatable/dataTable";
import { getPurchaseCompanyByUser } from "../../../store/apiSlice/purchaseCompanySlice";
import Modal from "../../../components/modal/modal";
import ItemTable from "../../../components/itemTable/itemTable";
import { getItemsByUser } from "../../../store/apiSlice/itemSlice";
import { validatePurchaseForm } from "../../../utils/validatePurchaseForm";
import {
  convertToWords,
  formatDate,
  formatRupees,
} from "../../../utils/formatters";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { render } from "react-dom";

const PurchasedItem = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getItemsByUser(loggedInUserId));
    dispatch(getPurchaseCompanyByUser(loggedInUserId));
    dispatch(getPurchasedItemsByUser(loggedInUserId));
  }, [dispatch]);

  const { items } = useSelector((state) => state.items);
  const { purchaseCompanies } = useSelector((state) => state.purchaseCompanies);
  const { purchasedItems } = useSelector((state) => state.purchasedItems);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [purchasedItemData, setPurchasedItemData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    purchaseCompany: "",
    date: new Date().toISOString().split("T")[0],
    purchaseCompanyChallanNo: "",
    items: [
      {
        srNo: 1,
        item: "",
        unitType: "",
        hsn: "",
        qty: parseFloat(0.0).toFixed(2),
        pricePerUnit: parseFloat(0.0).toFixed(2),
        amount: parseFloat(0.0).toFixed(2),
      },
    ],
    totalAmount: parseFloat(0.0).toFixed(2),
    roundOff: parseFloat(0.0).toFixed(2),
    finalAmount: parseFloat(0.0).toFixed(2),
    finalAmountInWords: "",
  });

  const itemsColumns = [
    { key: "srNo", label: "Sr No", type: "readonly", width: "5%" },
    {
      key: "item",
      label: "Item",
      type: "dropdown",
      width: "25%",
    },
    { key: "unitType", label: "Unit Type", type: "readonly", width: "15%" },
    { key: "hsn", label: "HSN", type: "text", width: "10%" },
    {
      key: "qty",
      label: "Quantity",
      type: "number",
      width: "10%",
    },
    {
      key: "pricePerUnit",
      label: "Price Per Unit",
      type: "number",
      width: "10%",
    },
    {
      key: "amount",
      label: "Amount",
      type: "readonly",
      width: "10%",
    },
  ];

  const allItemOptions = items?.map((item) => ({
    value: item._id,
    label: item.name,
    unitType: item.unitType,
  }));

  const handleChangePurchasedItemData = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...purchasedItemData, [name]: value };

    const totalAmount = parseFloat(updatedData.totalAmount) || 0;
    const roundedTotal = Math.round(totalAmount);
    const roundOff = (roundedTotal - totalAmount).toFixed(2);
    const finalAmount = totalAmount + parseFloat(roundOff) || 0;

    updatedData.totalAmount = totalAmount.toFixed(2);
    updatedData.roundOff = roundOff;
    updatedData.finalAmount = finalAmount.toFixed(2);
    updatedData.finalAmountInWords = convertToWords(finalAmount);

    setPurchasedItemData(updatedData);
  };

  const calculateTotal = (items) => {
    const total = items?.reduce((sum, item) => {
      const amt = parseFloat(item.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const totalAmount = parseFloat(total) || 0;
    const roundedTotal = Math.round(totalAmount);
    const roundOff = (roundedTotal - totalAmount).toFixed(2);
    const finalAmount = totalAmount + parseFloat(roundOff);
    const finalAmountInWords = convertToWords(finalAmount);

    setPurchasedItemData((prev) => ({
      ...prev,
      totalAmount: totalAmount.toFixed(2),
      roundOff: roundOff,
      finalAmount: finalAmount.toFixed(2),
      finalAmountInWords: finalAmountInWords,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchasedItemData.items];

    if (field === "item") {
      updatedItems[index][field] = value;

      const selectedItem = items?.find((opt) => opt._id === value);
      updatedItems[index].unitType = selectedItem ? selectedItem.unitType : "";
    } else {
      updatedItems[index][field] = value;
    }

    const qty = parseFloat(updatedItems[index].qty) || 0;
    const price = parseFloat(updatedItems[index].pricePerUnit) || 0;
    if (qty > 0 && price > 0) {
      updatedItems[index].amount = (qty * price).toFixed(2);
    } else {
      updatedItems[index].amount = 0;
    }

    setPurchasedItemData({
      ...purchasedItemData,
      items: updatedItems,
    });

    calculateTotal(updatedItems);
  };

  const addItem = () => {
    setPurchasedItemData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item: "",
          unitType: "",
          hsn: "",
          qty: parseFloat(0).toFixed(2),
          pricePerUnit: parseFloat(0).toFixed(2),
          amount: parseFloat(0).toFixed(2),
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = purchasedItemData.items?.filter((_, i) => i !== index);
    setPurchasedItemData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
    calculateTotal(updatedItems);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    if (type === "view") {
      setPurchasedItemData({
        loggedInUserId: loggedInUserId,
        _id: item._id,
        purchaseCompany: item.purchaseCompany,
        date: item.date,
        purchaseCompanyChallanNo: item.purchaseCompanyChallanNo,
        items: item.items,
        totalAmount: item.totalAmount,
        roundOff: item.roundOff,
        finalAmount: item.finalAmount,
        finalAmountInWords: item.finalAmountInWords,
      });
    } else if ((type === "edit" && item) || type === "add") {
      setPurchasedItemData({
        loggedInUserId: loggedInUserId,
        _id: item?._id || "",
        purchaseCompany: item?.purchaseCompany || "",
        date: item?.date || new Date().toISOString().split("T")[0],
        purchaseCompanyChallanNo: item?.purchaseCompanyChallanNo || "",
        items: item?.items?.length
          ? item.items?.map((itm, index) => ({
              ...itm,
              srNo: index + 1,
              item: itm.item || "",
              unitType: itm.unitType || "",
              hsn: itm.hsn || "",
              qty: parseFloat(itm.qty || 0).toFixed(2),
              pricePerUnit: parseFloat(itm.pricePerUnit || 0).toFixed(2),
              amount: parseFloat(itm.amount || 0).toFixed(2),
            }))
          : [
              {
                srNo: 1,
                item: "",
                unitType: "",
                hsn: "",
                qty: parseFloat(0.0).toFixed(2),
                pricePerUnit: parseFloat(0.0).toFixed(2),
                amount: parseFloat(0.0).toFixed(2),
              },
            ],
        totalAmount: parseFloat(item?.totalAmount || 0.0).toFixed(2),
        roundOff: parseFloat(item?.roundOff || 0.0).toFixed(2),
        finalAmount: parseFloat(item?.finalAmount || 0.0).toFixed(2),
        finalAmountInWords: item?.finalAmountInWords || "",
      });
    } else if (type === "delete") {
      setPurchasedItemData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: item._id,
        purchaseCompany: item.purchaseCompany,
        date: item.date,
        purchaseCompanyChallanNo: item.purchaseCompanyChallanNo,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setPurchasedItemData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      purchaseCompany: "",
      date: new Date().toISOString().split("T")[0],
      purchaseCompanyChallanNo: "",
      items: [
        {
          srNo: 1,
          item: "",
          unitType: "",
          hsn: "",
          qty: parseFloat(0.0).toFixed(2),
          pricePerUnit: parseFloat(0.0).toFixed(2),
          amount: parseFloat(0.0).toFixed(2),
        },
      ],
      totalAmount: parseFloat(0.0).toFixed(2),
      roundOff: parseFloat(0.0).toFixed(2),
      finalAmount: parseFloat(0.0).toFixed(2),
      finalAmountInWords: "",
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (purchasedItemData.purchaseCompany === "") {
        showToast("Please select a purchase company", "error");
        return;
      } else if (!purchasedItemData.date) {
        showToast("Please select a date", "error");
        return;
      } else if (purchasedItemData.items?.length === 0) {
        showToast("Please add at least one item", "error");
        return;
      } else if (
        purchasedItemData.items.some(
          (item) =>
            !item.item ||
            !item.unitType ||
            item.qty <= 0 ||
            item.pricePerUnit <= 0,
        )
      ) {
        showToast("Please fill all item details correctly", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updatePurchasedItem(purchasedItemData)).then((res) => {
          if (res.payload?.success) {
            dispatch(stopLoading());
            showToast("Purchased item updated successfully", "success");
            dispatch(getPurchasedItemsByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update item", "error");
          }
        });
      }
    } else {
      if (purchasedItemData.purchaseCompany === "") {
        showToast("Please select a purchase company", "error");
        return;
      } else if (!purchasedItemData.date) {
        showToast("Please select a date", "error");
        return;
      } else if (purchasedItemData.items?.length === 0) {
        showToast("Please add at least one item", "error");
        return;
      } else if (
        purchasedItemData.items.some(
          (item) =>
            !item.item ||
            !item.unitType ||
            item.qty <= 0 ||
            item.pricePerUnit <= 0,
        )
      ) {
        showToast("Please fill all item details correctly", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addPurchasedItem(purchasedItemData)).then((res) => {
          if (res.payload?.success) {
            showToast("Purchased item added successfully", "success");
            dispatch(getPurchasedItemsByUser(loggedInUserId));
            closeModal();
            dispatch(stopLoading());
          } else {
            showToast("Failed to add purchased item", "error");
            dispatch(stopLoading());
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!purchasedItemData.password) {
      showToast("Please enter your password", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deletePurchasedItem(purchasedItemData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password", "error");
        } else if (res.payload?.success) {
          dispatch(stopLoading());
          showToast("Purchased item deleted successfully", "success");
          dispatch(getPurchasedItemsByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete item", "error");
        }
      });
    }
  };

  const totalPurchase = purchasedItems?.reduce(
    (sum, bill) => sum + (bill?.finalAmount || 0),
    0,
  );

  const extractChallanNumber = (challanNo) => {
    if (!challanNo) return 0;
    const match = challanNo.match(/(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  };
  const data = purchasedItems
    ?.slice()
    ?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // 🔥 Sort by Date (latest first)
      if (dateB - dateA !== 0) return dateB - dateA;

      // 🔥 If same date → sort by Challan No number
      const numA = extractChallanNumber(a.purchaseCompanyChallanNo);
      const numB = extractChallanNumber(b.purchaseCompanyChallanNo);

      return numB - numA;
    })
    ?.map((item, index) => ({
      ...item,
      srNo: index + 1,
      _id: item._id,
      purchaseCompany: item.purchaseCompany,
      date: item.date,
      purchaseCompanyChallanNo: item.purchaseCompanyChallanNo,
      totalAmount: item.totalAmount,
      roundOff: item.roundOff,
      finalAmount: item.finalAmount,
      finalAmountInWords: item.finalAmountInWords,
    }));

  const columns = [
    { header: "Sr No", accessor: "srNo", filterType: "text" },
    {
      header: "Challan No",
      accessor: "purchaseCompanyChallanNo",
      filterType: "text",
    },

    {
      header: "Purchase Company",
      accessor: "purchaseCompany",
      filterType: "text",
      render: (row) => {
        const company = purchaseCompanies?.find(
          (company) => company._id === row,
        );
        return company ? company.name : "N/A";
      },
    },
    {
      header: "Date",
      accessor: "date",
      filterType: "date-range",
      size: "md",
      render: (value) => formatDate(value),
    },

    {
      header: "Total Amount",
      accessor: "totalAmount",
      filterType: "text",
      render: (val) => formatRupees(val),
    },
    {
      header: "Round Off",
      accessor: "roundOff",
      filterType: "text",
      render: (val) => formatRupees(val),
    },
    {
      header: "Final Amount",
      accessor: "finalAmount",
      filterType: "text",
      render: (val) => formatRupees(val),
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
      ],
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Purchased Item Management</h2>
          <div className="summary-cards small">
            <div className="card total">
              <p className="title">Total</p>
              <h4 className="value">{formatRupees(totalPurchase || 0)}</h4>
            </div>
          </div>
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
            selectedIds.includes(i + 1),
          );
          setSelectedData(selected);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Purchased Item"
            : modalType === "edit"
              ? "Edit Purchased Item"
              : modalType === "delete"
                ? "Delete Purchased Item"
                : "Add Purchased Item"
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
        {modalType === "view" && purchasedItemData ? (
          <>
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Purchase Company : </label>
                  <p>
                    {purchaseCompanies?.find(
                      (company) =>
                        company._id === purchasedItemData.purchaseCompany,
                    )?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Date : </label>
                  <p>{formatDate(purchasedItemData.date)}</p>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Challan No : </label>
                  <p>{purchasedItemData.purchaseCompanyChallanNo || "N/A"}</p>
                </div>
              </div>
            </div>
            <ItemTable
              items={purchasedItemData.items}
              columns={itemsColumns}
              onItemChange={handleItemChange}
              itemOptions={allItemOptions}
            />
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Total Amount : </label>
                  <p>{purchasedItemData.totalAmount}</p>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Round Off : </label>
                  <p>{purchasedItemData.roundOff}</p>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Final Amount : </label>
                  <p>{purchasedItemData.finalAmount}</p>
                </div>
              </div>
            </div>
            <div className="input-group">
              <label>
                Final Amount in Words : {purchasedItemData.finalAmountInWords}
              </label>
            </div>
          </>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="purchaseCompany">Purchase Company</label>
                  <select
                    name="purchaseCompany"
                    value={purchasedItemData.purchaseCompany}
                    onChange={handleChangePurchasedItemData}
                  >
                    <option value="">Select Company</option>
                    {purchaseCompanies?.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={purchasedItemData.date}
                    onChange={handleChangePurchasedItemData}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label htmlFor="purchaseCompanyChallanNo">Challan No</label>
                  <input
                    type="text"
                    name="purchaseCompanyChallanNo"
                    value={purchasedItemData.purchaseCompanyChallanNo}
                    onChange={handleChangePurchasedItemData}
                    placeholder="Enter Challan No"
                  />
                </div>
              </div>
            </div>
            <ItemTable
              items={purchasedItemData.items}
              columns={itemsColumns}
              onItemChange={handleItemChange}
              onRemoveItem={removeItem}
              onAddItem={addItem}
              itemOptions={allItemOptions}
            />
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <label>Total Amount</label>
                  <input
                    type="text"
                    name="totalAmount"
                    value={purchasedItemData.totalAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Round Off</label>
                  <input
                    type="text"
                    name="roundOff"
                    value={purchasedItemData.roundOff}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Final Amount</label>
                  <input
                    type="text"
                    name="finalAmount"
                    value={purchasedItemData.finalAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <label>Final Amount in Words</label>
              <input
                type="text"
                name="finalAmountInWords"
                value={purchasedItemData.finalAmountInWords}
                readOnly
                disabled
              />
            </div>
          </>
        ) : modalType === "delete" && purchasedItemData ? (
          <>
            <p>Are you sure you want to delete the bill?</p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={purchasedItemData.password}
                onChange={handleChangePurchasedItemData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default PurchasedItem;
