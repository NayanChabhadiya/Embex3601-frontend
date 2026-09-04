import html2pdf from "html2pdf.js";

export const downloadPDFLandscape = (
  elementRef,
  filename = "invoice-landscape.pdf"
) => {
  if (!elementRef.current) return;

  const element = elementRef.current;
  element.classList.add("show-in-pdf");

  const opt = {
    margin: [-3, -3],
    filename,
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape", // 💡 Change to landscape
    },
  };

  setTimeout(() => {
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        element.classList.remove("show-in-pdf");
      })
      .catch(() => {
        element.classList.remove("show-in-pdf");
      });
  }, 500);
};
