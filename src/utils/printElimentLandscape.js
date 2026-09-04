export const printElementLandscape = (element, landscape = false) => {
  if (!element) return;

  const printWindow = window.open("", "_blank", "width=1200,height=800");
  const cloned = element.cloneNode(true);
  const doc = printWindow.document;

  doc.open();
  doc.write("<html><head><title>Print</title>");

  // Add style for landscape if requested
  if (landscape) {
    doc.write(`
      <style>
        @page {
          size: A4 landscape;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          margin: 0;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
      </style>
    `);
  }

  doc.write("</head><body></body></html>");
  doc.close();

  // Copy external stylesheets and inline CSS
  Array.from(document.styleSheets)?.forEach((styleSheet) => {
    try {
      if (styleSheet.href) {
        const linkEl = doc.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = styleSheet.href;
        doc.head.appendChild(linkEl);
      } else if (styleSheet.cssRules) {
        const styleEl = doc.createElement("style");
        const rules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
        styleEl.appendChild(doc.createTextNode(rules));
        doc.head.appendChild(styleEl);
      }
    } catch (e) {}
  });

  // Append cloned content
  doc.body.appendChild(cloned);

  // Ensure print runs after page is fully loaded
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};
