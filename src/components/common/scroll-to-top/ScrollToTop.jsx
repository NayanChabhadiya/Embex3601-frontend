import { useEffect, useState } from "react";
import { Button } from "../button";
import "./scroll-to-top.scss";

const ArrowUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

const ScrollToTop = ({ threshold = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="scroll-to-top">
      <Button
        variant="primary"
        size="medium"
        className="scroll-to-top__button"
        onClick={handleScrollToTop}
        ariaLabel="Scroll to top"
        icon={<ArrowUpIcon />}
      />
    </div>
  );
};

export default ScrollToTop;
