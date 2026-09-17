function ViewIcon({ size = 17, strokeWidth = 2, onClick, title }) {
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
        marginRight: "8px",
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
      <circle cx="24" cy="24" r="21" fill="#E8F2FF" />

      <path
        d="M13 24C13 24 17 16 24 16C31 16 35 24 35 24C35 24 31 32 24 32C17 32 13 24 13 24Z"
        stroke="#1769C2"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="24"
        cy="24"
        r="4"
        stroke="#1769C2"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default ViewIcon;
