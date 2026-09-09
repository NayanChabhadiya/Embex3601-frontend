import "./button.scss";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  icon = null,
  iconPosition = "right",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  onClick,
  ariaLabel,
}) => {
  const buttonClasses = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? "button--full-width" : "",
    loading ? "button--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {loading ? (
        <span className="button__loader" aria-hidden="true" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span
              className="button__icon button__icon--left"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <span className="button__label">{children}</span>

          {icon && iconPosition === "right" && (
            <span
              className="button__icon button__icon--right"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
