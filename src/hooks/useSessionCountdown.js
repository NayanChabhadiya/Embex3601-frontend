import { useState, useEffect, useRef } from "react";

const useSessionCountdown = (duration = 30 * 60 * 1000) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const resetTimer = () => {
    setTimeLeft(duration);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.clear();
      window.location.href = "/login";
    }, duration);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events?.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => {
      events?.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return { minutes, seconds };
};

export default useSessionCountdown;
