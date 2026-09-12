import { useDispatch, useSelector } from "react-redux";

import {
  login,
  logout,
  initializeSession,
  refreshToken,
  logoutAll,
} from "../store/auth.thunks";

const useAuth = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  return {
    ...auth,

    login: (credentials) => dispatch(login(credentials)),
    logout: () => dispatch(logout()),
    logoutAll: () => dispatch(logoutAll()),
    initialize: () => dispatch(initializeSession()),
    refresh: () => dispatch(refreshToken()),
  };
};

export default useAuth;
