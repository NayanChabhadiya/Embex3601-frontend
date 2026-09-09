import { createContext, useContext, useState } from "react";

import Loader from "./Loader";

const LoaderContext = createContext(null);

function LoaderProvider({ children }) {
  const [loader, setLoader] = useState(null);

  const showLoader = ({
    type = "overlay",
    size = "medium",
    text = "Please wait...",
  } = {}) => {
    setLoader({
      type,
      size,
      text,
    });
  };

  const hideLoader = () => {
    setLoader(null);
  };

  return (
    <LoaderContext.Provider
      value={{
        showLoader,
        hideLoader,
        isLoading: Boolean(loader),
      }}
    >
      {children}

      {loader && (
        <Loader type={loader.type} size={loader.size} text={loader.text} />
      )}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader must be used inside LoaderProvider.");
  }

  return context;
}

export default LoaderProvider;
