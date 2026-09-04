// utils/downloadLedgerPDF.js
import html2pdf from "html2pdf.js";

export const generateLedgerHtmlPdf = (
  elementId = "ledger-pdf",
  filename = "ledger.pdf"
) => {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  element.style.display = "block"; // Show before exporting

  const opt = {
    margin: [5, 5],
    filename,
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: true,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  setTimeout(() => {
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        element.style.display = "none"; // Hide again
      })
      .catch((err) => {
        element.style.display = "none";
      });
  }, 500);
};
