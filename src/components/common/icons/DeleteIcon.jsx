function DeleteIcon({ size = 17, strokeWidth = 2, onClick, title }) {
  const containerSize = size + 30;

  return (
    <svg
      width={containerSize}
      height={containerSize}
      viewBox="0 0 48 48"
      fill="none"
      onClick={onClick}
      title={title}
      aria-label={title}
      role={onClick ? "button" : undefined}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "scale(1.06)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "scale(1)";
      }}
    >
      <circle cx="24" cy="24" r="21" fill="#FDECEC" />

      <path
        d="M16 17H32"
        stroke="#B91C1C"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d="M20 17V14H28V17"
        stroke="#B91C1C"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 18L19 34H29L30 18"
        stroke="#B91C1C"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M22 22V30"
        stroke="#B91C1C"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d="M26 22V30"
        stroke="#B91C1C"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default DeleteIcon;
