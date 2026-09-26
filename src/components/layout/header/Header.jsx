import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./header.scss";

import Badge from "../../common/badge/Badge.jsx";

import { logout } from "../../../modules/auth/store/authentication.thunks.js";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authentication?.user);

  const platformAdminAccess = {
    role: user?.role || "super_admin",
  };

  const platformAdminRoles = platformAdminAccess?.role
    ? platformAdminAccess.role.replace(/_/g, " ").toUpperCase()
    : null;

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email ||
    "User";

  const userType = (user?.type || "User").toUpperCase();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);

      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-header__title">Embex360</span>
      </div>

      <div className="app-header__right">
        <div className="app-header__account">
          <strong>{displayName}</strong>

          {user?.email && <span>{user.email}</span>}

          <div className="app-header__badges">
            <Badge variant="neutral">{userType}</Badge>

            {platformAdminRoles && (
              <Badge variant="primary">{platformAdminRoles}</Badge>
            )}
          </div>
        </div>

        <button
          type="button"
          className="app-header__logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
