import "./badge.scss";

function Badge({
  children,
  variant = "neutral",
  size = "small",
  className = "",
}) {
  const badgeClassName = [
    "badge",
    `badge--${variant}`,
    `badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={badgeClassName}>{children}</span>;
}

export default Badge;
