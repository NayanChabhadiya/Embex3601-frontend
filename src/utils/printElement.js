export const printElement = (element) => {
  if (!element) return;

  const printWindow = window.open("", "_blank", "width=800,height=600");

  const cloned = element.cloneNode(true);
  const doc = printWindow.document;

  doc.open();
  doc.write("<html><head><title>Print</title></head><body></body></html>");
  doc.close();

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
          ?.map((rule) => rule.cssText)
          .join("\n");
        styleEl.appendChild(doc.createTextNode(rules));
        doc.head.appendChild(styleEl);
      }
    } catch (e) {}
  });

  doc.body.appendChild(cloned);

  const closeAfterPrint = () => {
    setTimeout(() => {
      printWindow.close();
    }, 200);
  };

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = closeAfterPrint;
  };
};
