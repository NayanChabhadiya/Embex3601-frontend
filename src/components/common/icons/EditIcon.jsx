function EditIcon({ size = 17, strokeWidth = 2, onClick, title }) {
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
      <circle cx="24" cy="24" r="21" fill="#E8F8EC" />

      <path
        d="M15 33L16.5 27.5L30.5 13.5C31.9 12.1 34.1 12.1 35.5 13.5C36.9 14.9 36.9 17.1 35.5 18.5L21.5 32.5L15 33Z"
        stroke="#16A34A"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M28 16L32 20"
        stroke="#16A34A"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default EditIcon;
