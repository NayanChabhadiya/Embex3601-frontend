import html2pdf from "html2pdf.js";

export const downloadPDF = (elementRef, filename = "invoice.pdf") => {
  if (!elementRef.current) return;

  const element = elementRef.current;
  element.classList.add("show-in-pdf");

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
        element.classList.remove("show-in-pdf");
      })
      .catch((err) => {
        element.classList.remove("show-in-pdf");
      });
  }, 500);
};
