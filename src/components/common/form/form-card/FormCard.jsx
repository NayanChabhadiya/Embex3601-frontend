import Card from "../../card/Card";
import "./form-card.scss";

function FormCard({ children, className = "" }) {
  const formCardClassName = ["form-card", className].filter(Boolean).join(" ");

  return <Card className={formCardClassName}>{children}</Card>;
}

export default FormCard;