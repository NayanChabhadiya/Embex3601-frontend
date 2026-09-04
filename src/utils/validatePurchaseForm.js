export const validatePurchaseForm = (data) => {
  const errors = {};

  if (!data.purchaseCompany) errors.purchaseCompany = "Unit type is required.";
  if (!data.date) errors.date = "Date is required.";
  if (!data.purchaseCompanyChallanNo?.trim()) errors.purchaseCompanyChallanNo = "Challan No is required.";

  data.items?.forEach((item, index) => {
    const itemErrors = {};
    if (!item.item?.trim()) itemErrors.item = "Item is required.";
    if (!item.unitType?.trim()) itemErrors.unitType = "Unit type is required.";
    if (!item.hsn?.trim()) itemErrors.hsn = "HSN is required.";
    if (!item.qty || isNaN(item.qty)) itemErrors.qty = "Qty must be a number.";
    if (!item.pricePerUnit || isNaN(item.pricePerUnit)) itemErrors.pricePerUnit = "Price per unit must be a number.";

    if (Object.keys(itemErrors)?.length > 0) {
      if (!errors.items) errors.items = {};
      errors.items[index] = itemErrors;
    }
  });

  if (data.totalAmount && isNaN(data.totalAmount)) errors.totalAmount = "Total amount must be a number.";
  if (data.finalAmount && isNaN(data.finalAmount)) errors.finalAmount = "Final amount must be a number.";

  return errors;
};