import "./card.scss";

function Card({ children, className = "" }) {
  const cardClassName = ["card", className].filter(Boolean).join(" ");

  return <div className={cardClassName}>{children}</div>;
}

export default Card;
