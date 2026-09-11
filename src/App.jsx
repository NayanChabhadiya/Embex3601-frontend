import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { initializeSession } from "./modules/auth/store/auth.thunks";
import router from "./router";

function App() {
  const dispatch = useDispatch();

  const { initialized } = useSelector((state) => state.auth);
  const initializationStarted = useRef(false);

  useEffect(() => {
    if (initializationStarted.current) {
      return;
    }

    initializationStarted.current = true;

    dispatch(initializeSession());
  }, [dispatch]);

  if (!initialized) {
    return null;
  }

  return <RouterProvider router={router} />;
}

export default App;
