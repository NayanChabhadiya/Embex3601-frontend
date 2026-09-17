function GridItem({ children, columnSpan = 1, rowSpan = 1, className = "" }) {
  const gridItemClassName = ["grid__item", className].filter(Boolean).join(" ");

  return (
    <div
      className={gridItemClassName}
      style={{
        "--grid-column-span": columnSpan,
        "--grid-row-span": rowSpan,
      }}
    >
      {children}
    </div>
  );
}

export default GridItem;
