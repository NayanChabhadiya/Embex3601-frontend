import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useSessionTimeout = (timeoutDuration = 30 * 60 * 1000) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.clear(); // or dispatch logout from redux
      navigate("/login"); // redirect to login
    }, timeoutDuration);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];

    events?.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // start timer on mount

    return () => {
      events?.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timerRef.current);
    };
  }, []);
};

export default useSessionTimeout;
