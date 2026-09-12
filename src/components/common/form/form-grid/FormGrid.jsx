import "./form-grid.scss";

function FormGrid({ children, columns = 2, gap = 16, className = "" }) {
  const formGridClassName = ["form-grid", className].filter(Boolean).join(" ");

  return (
    <div
      className={formGridClassName}
      style={{
        "--form-grid-columns": columns,
        "--form-grid-gap": `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

export default FormGrid;
