import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { refresh } from "../store/authentication.thunks.js";
import { clearAuthentication } from "../store/authentication.slice.js";

const AuthenticationBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const refreshToken = localStorage.getItem("embex360_refresh_token");

    if (!refreshToken) {
      dispatch(clearAuthentication());
      return;
    }

    dispatch(
      refresh({
        refreshToken,
      }),
    );
  }, [dispatch]);

  return children;
};

export default AuthenticationBootstrap;
