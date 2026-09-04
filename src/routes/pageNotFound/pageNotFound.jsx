import "./pageNotFound.scss";
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you’re looking for doesn’t exist or was moved.</p>
        <Link to="/" className="back-home">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
