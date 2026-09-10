import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshSession } from "./modules/auth/store/auth.thunks";
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(refreshSession());
  }, [dispatch]);

  if (isInitializing) {
    return null;
  }

  return <RouterProvider router={router} />;
}

export default App;
