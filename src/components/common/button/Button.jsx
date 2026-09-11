import "./button.scss";

function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
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
      onClick={onClick}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
