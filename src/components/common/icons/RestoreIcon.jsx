function RestoreIcon({ size = 17, strokeWidth = 2, onClick, title }) {
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
        d="M16 20C18 16 21 14 25 14C31 14 35 18 35 24C35 30 31 34 25 34C21 34 18 32 16 29"
        stroke="#1769C2"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M16 14V20H22"
        stroke="#1769C2"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default RestoreIcon;
