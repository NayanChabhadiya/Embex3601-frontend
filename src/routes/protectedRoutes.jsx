import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { loginUser, logoutUser } from "../store/apiSlice/authSlice";

const ProtectedRoutes = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loginUser({ authUser }));
      const timeLeftToExpireToken = token
        ? JSON.parse(atob(token.split(".")[1])).exp - Date.now() / 1000
        : 0;
      if (timeLeftToExpireToken <= 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        dispatch(logoutUser());
      } else {
        const intervalId = setInterval(() => {
          const timeLeftToExpireToken = token
            ? JSON.parse(atob(token.split(".")[1])).exp - Date.now() / 1000
            : 0;
          if (timeLeftToExpireToken <= 0) {
            localStorage.removeItem("token");
            localStorage.removeItem("authUser");
            dispatch(logoutUser());
          }
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }
  }, []);

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoutes;
