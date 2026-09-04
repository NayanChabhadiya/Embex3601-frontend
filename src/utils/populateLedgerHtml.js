// utils/populateLedgerHtml.js
export const populateLedgerHtml = (data, columns, companyName, merchantName) => {
  const container = document.getElementById("ledger-pdf");
  if (!container) return;

  // Create title
  const title = `
    <h2 style="text-align:center; margin-bottom: 10px;">
      Ledger Report
    </h2>
    <h4 style="text-align:center; margin-top: 0;">
      ${companyName || "--"} - ${merchantName || "--"}
    </h4>
  `;

  // Create table
  const tableHeaders = columns
    .map((col) => `<th style="padding:4px;border:1px solid #ddd;">${col.header}</th>`)
    .join("");

  let grandTotals = {};

  const tableRows = data
    .map((row) => {
      return (
        "<tr>" +
        columns
          .map((col) => {
            let value = row[col.accessor];
            if (typeof col.render === "function") {
              value = col.render(value, row);
            }

            // Accumulate grand totals
            if (col.grandTotal) {
              const numericValue = parseFloat(row[col.accessor]) || 0;
              grandTotals[col.accessor] = (grandTotals[col.accessor] || 0) + numericValue;
            }

            return `<td style="padding:4px;border:1px solid #ddd;">${value ?? "--"}</td>`;
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");

  // Grand total row
  const grandTotalRow =
    "<tr>" +
    columns
      .map((col) => {
        if (col.grandTotal) {
          const value = grandTotals[col.accessor] || 0;
          return `<td style="padding:4px;border:1px solid #ddd; font-weight:bold;">${col.render ? col.render(value) : value}</td>`;
        }
        return `<td style="padding:4px;border:1px solid #ddd;"></td>`;
      })
      .join("") +
    "</tr>";

  // Final HTML
  const html = `
    <div style="padding: 10px; font-family: Arial, sans-serif;">
      ${title}
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>
          ${tableRows}
          ${grandTotalRow}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
};
