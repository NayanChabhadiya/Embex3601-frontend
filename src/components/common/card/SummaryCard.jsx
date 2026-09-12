import Card from "./Card";
import "./summary-card.scss";

function SummaryCard({
  title,
  value,
  description,
  trend,
  trendType = "neutral",
}) {
  return (
    <Card className="summary-card">
      <div className="summary-card__title">{title}</div>

      <div className="summary-card__value">{value}</div>

      <div className="summary-card__footer">
        {description && (
          <span className="summary-card__description">{description}</span>
        )}

        {trend && (
          <span
            className={`summary-card__trend summary-card__trend--${trendType}`}
          >
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}

export default SummaryCard;
