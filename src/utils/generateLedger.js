// utils/downloadLedgerPDF.js
import html2pdf from "html2pdf.js";

export const generateLedger = ({ selectedData, ledgerFields }) => {
  if (!selectedData || selectedData.length === 0) return;

  const companyName = selectedData[0]?.companyName || "Company";
  const merchantName = selectedData[0]?.merchantName || "Merchant";

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.style.padding = "20px";
  wrapper.style.fontFamily = "Arial, sans-serif";
  wrapper.style.fontSize = "12px";

  // Title
  const title = document.createElement("h2");
  title.textContent = `${companyName} - ${merchantName} Ledger`;
  title.style.textAlign = "center";
  title.style.marginBottom = "20px";
  wrapper.appendChild(title);

  // Table
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.marginBottom = "10px";

  // Thead
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  ledgerFields?.forEach((field) => {
    const th = document.createElement("th");
    th.textContent = field.header;
    th.style.border = "1px solid #ddd";
    th.style.padding = "6px";
    th.style.background = "#f2f2f2";
    th.style.fontWeight = "bold";
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Tbody
  const tbody = document.createElement("tbody");
  selectedData?.forEach((row) => {
    const tr = document.createElement("tr");

    ledgerFields?.forEach((field) => {
      const td = document.createElement("td");
      const value = field.render
        ? field.render(row[field.accessor], row)
        : row[field.accessor] ?? "--";
      td.textContent = value;
      td.style.border = "1px solid #ddd";
      td.style.padding = "6px";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // Total Row
  const totalRow = document.createElement("tr");
  ledgerFields?.forEach((field) => {
    const td = document.createElement("td");
    td.style.border = "1px solid #ddd";
    td.style.padding = "6px";
    td.style.fontWeight = "bold";

    if (field.grandTotal) {
      const total = selectedData.reduce(
        (sum, row) => sum + (parseFloat(row[field.accessor]) || 0),
        0
      );
      td.textContent = `₹${total.toLocaleString("en-IN")}`;
    } else {
      td.textContent = "";
    }

    totalRow.appendChild(td);
  });

  tbody.appendChild(totalRow);
  table.appendChild(tbody);
  wrapper.appendChild(table);

  // Generate PDF
  html2pdf()
    .set({
      margin: 0.3,
      filename: `${companyName}_${merchantName}_Ledger.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    })
    .from(wrapper)
    .save();
};
