function DeactivateIcon({ size = 17, strokeWidth = 2, onClick, title }) {
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
      <circle cx="24" cy="24" r="21" fill="#FFF4E5" />

      <path
        d="M17 17L31 31"
        stroke="#D97706"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d="M31 17L17 31"
        stroke="#D97706"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default DeactivateIcon;
