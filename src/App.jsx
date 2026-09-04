import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useDispatch, useSelector } from "react-redux";
import "./assets/styles/main.scss";
import Loader from "./components/loader/loader";
import { startLoading, stopLoading } from "./store/apiSlice/componentSlice";
import { useEffect } from "react";

function App() {
  const components = useSelector((state) => state.components);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(startLoading());

    setTimeout(() => {
      dispatch(stopLoading());
    }, 1000);
  }, [startLoading, stopLoading]);
  return (
    <>
      {components.isLoading ? <Loader /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
