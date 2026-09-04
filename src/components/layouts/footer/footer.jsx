import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const isSidebarOpen = useSelector((state) => state.components.isSidebarOpen);

  return (
    <footer className={`footer ${isSidebarOpen ? "expanded" : ""}`}>
      © {new Date().getFullYear()} Embex International Private Limited. All Rights Reserved.
    </footer>
  );
};

export default Footer;
