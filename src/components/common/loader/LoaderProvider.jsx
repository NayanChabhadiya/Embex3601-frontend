import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import Loader from "./Loader";

const LoaderContext = createContext(null);

const LoaderProvider = ({ children }) => {
  const [loader, setLoader] = useState(null);
  const activeLoaderIdRef = useRef(null);

  const showLoader = useCallback(
    ({
      type = "overlay",
      size = "medium",
      text = "Please wait...",
      brand = false,
    } = {}) => {
      const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      activeLoaderIdRef.current = id;

      setLoader({
        id,
        type,
        size,
        text,
        brand,
      });

      return id;
    },
    [],
  );

  const hideLoader = useCallback((id = null) => {
    if (id && activeLoaderIdRef.current && id !== activeLoaderIdRef.current) {
      return;
    }

    activeLoaderIdRef.current = null;
    setLoader(null);
  }, []);

  const updateLoader = useCallback((updates = {}) => {
    setLoader((currentLoader) => {
      if (!currentLoader) {
        return currentLoader;
      }

      return {
        ...currentLoader,
        ...updates,
      };
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      showLoader,
      hideLoader,
      updateLoader,
      isLoading: Boolean(loader),
    }),
    [showLoader, hideLoader, updateLoader, loader],
  );

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}

      {loader?.type === "page" && (
        <Loader
          fullPage
          size={loader.size}
          text={loader.text}
          brand={loader.brand}
        />
      )}

      {loader?.type === "overlay" && (
        <Loader
          overlay
          size={loader.size}
          text={loader.text}
          brand={loader.brand}
        />
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader must be used inside LoaderProvider.");
  }

  return context;
};

export default LoaderProvider;
