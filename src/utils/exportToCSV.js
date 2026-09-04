export const exportToCSV = (data, headers, filename = "export.csv") => {
  // Add UTF-8 BOM to fix ₹ and other special characters in Excel
  let csvContent = "\uFEFF";

  // Header row
  const headerRow = headers.map((h) => `"${h.header}"`).join(",");
  csvContent += headerRow + "\n";

  // Data rows
  data?.forEach((row) => {
    const rowData = headers.map((h) => {
      let value = row[h.accessor] ?? "";

      // Format numbers if they contain currency
      if (typeof value === "string") {
        value = value.replace(/"/g, '""'); // Escape double quotes
      }

      return `"${value}"`;
    });

    csvContent += rowData.join(",") + "\n";
  });

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
