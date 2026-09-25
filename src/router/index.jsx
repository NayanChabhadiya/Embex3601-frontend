import { createBrowserRouter } from "react-router-dom";

import { NotFound } from "../modules/public/pages/not-found";
import Dashboard from "../modules/dashboard/pages/dashboard/Dashboard.jsx";

import AppLayout from "../components/layout/AppLayout";

import Login from "../modules/auth/pages/login/Login.jsx";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
