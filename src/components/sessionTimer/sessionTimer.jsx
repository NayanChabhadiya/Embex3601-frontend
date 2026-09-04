import "./sessionTimer.scss";

const SessionTimer = ({ duration }) => {
  const days = Math.floor(duration / (24 * 60 * 60));
  const hours = Math.floor((duration % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = duration % 60;

  const progressPercent = (duration / duration) * 100;

  return (
    <div className="session-timer-card">
      <div className="timer-label">Session Expires In</div>
      <div className="timer-countdown">
        <span>{String(days).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(hours).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(minutes).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
      <div className="timer-bar">
        <div
          className="progress"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SessionTimer;
