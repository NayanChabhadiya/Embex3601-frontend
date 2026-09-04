import "./circularCountdown.scss"; // Ensure you have the correct path to your CSS file

const Circle = ({ value, max, label }) => {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * 100;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="circle-wrapper">
      <div className="svg-container">
        <svg width="35" height="35">
          <defs>
            <linearGradient
              id={`gradient-${label}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#2979ff" />
            </linearGradient>
          </defs>

          <circle
            r={radius}
            cx="17.5"
            cy="17.5"
            fill="transparent"
            stroke="#2f2f2f"
            strokeWidth="4"
          />
          <circle
            r={radius}
            cx="17.5"
            cy="17.5"
            fill="transparent"
            stroke={`url(#gradient-${label})`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s linear",
            }}
          />
        </svg>
        <div className="circle-value">{value.toString().padStart(2, "0")}</div>
      </div>

      <div className="unit">{label}</div>
    </div>
  );
};

const CircularCountdown = ({ sessionDurationInSeconds }) => {
  const days = Math.floor(sessionDurationInSeconds / (24 * 3600));
  const hours = Math.floor((sessionDurationInSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((sessionDurationInSeconds % 3600) / 60);
  const seconds = sessionDurationInSeconds % 60;

  return (
    <div className="multi-circle-container">
      <Circle value={days} max={30} label="Days" />
      <Circle value={hours} max={24} label="Hours" />
      <Circle value={minutes} max={60} label="Minutes" />
      <Circle value={seconds} max={60} label="Seconds" />
    </div>
  );
};

export default CircularCountdown;
