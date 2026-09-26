import { RouterProvider } from "react-router-dom";

import router from "./router/index.jsx";
import AuthenticationBootstrap from "./modules/auth/components/AuthenticationBootstrap.jsx";

function App() {
  return (
    <AuthenticationBootstrap>
      <RouterProvider router={router} />
    </AuthenticationBootstrap>
  );
}

export default App;
