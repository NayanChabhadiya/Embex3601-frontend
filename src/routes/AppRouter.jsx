import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { APP_ROUTES } from "../constant";
import { LoginPage } from "../modules/auth/pages/login";
import { PublicHomePage } from "../modules/public/pages/home";
import { NotFoundPage } from "../modules/public/pages/not-found";
import { selectIsAuthenticated } from "../modules/auth/store/auth.selectors";
import { PublicRoute } from "./guards";

const AppRouter = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
        <Route path={APP_ROUTES.FALLBACK} element={<PublicHomePage />} />

        <Route path={APP_ROUTES.PUBLIC.LOGIN} element={<LoginPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
