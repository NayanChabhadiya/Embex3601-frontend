import { Button } from "../../../../components/common/button";

import { useNavigate } from "react-router-dom";
import useAuth from "../../../auth/hooks/useAuth";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>

      <Button
        type="button"
        variant="danger"
        onClick={async () => {
          await logout();
          navigate("/login", { replace: true });
        }}
      >
        Logout
      </Button>
    </main>
  );
}

export default Dashboard;
