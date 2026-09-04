import React, { useEffect, useState, useRef } from "react";
import "./sessionTimer.scss";

const SessionTimer = ({ duration = 30 * 60 }) => {
  const [timeLeft, setTimeLeft] = useState(duration); // in seconds
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const progressPercent = (timeLeft / duration) * 100;

  return (
    <div className="session-timer-card">
      <div className="timer-label">Session Expires In</div>
      <div className="timer-countdown">
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
