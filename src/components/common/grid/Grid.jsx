import "./grid.scss";

function Grid({
  children,
  columns = 1,
  gap = 16,
  className = "",
}) {
  const gridClassName = ["grid", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={gridClassName}
      style={{
        "--grid-columns": columns,
        "--grid-gap": `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

export default Grid;