import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "../modules/auth/pages";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: null,
  },
]);

export default router;
