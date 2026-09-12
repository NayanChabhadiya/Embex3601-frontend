import "./button.scss";

function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  onClick,
  className = "",
  ...props
}) {
  const buttonClassName = ["button", `button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}

export default Button;
