import { useEffect, useState } from "react";

const CountUp = ({ end, duration = 2000, prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 30); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 30);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{prefix}{count.toLocaleString("en-IN")}</>;
};

export default CountUp;
