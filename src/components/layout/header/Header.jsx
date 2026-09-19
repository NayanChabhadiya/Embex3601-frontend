import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./header.scss";
import Badge from "../../common/badge/Badge.jsx";

function Header() {
  const navigate = useNavigate();

  const user = null;

  const platformAdminAccess = {
    role: "super_admin",
  };

  const platformAdminRoles = platformAdminAccess?.role
    ? platformAdminAccess.role.replace(/\_/g, " ").toUpperCase()
    : null;

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email ||
    "User";

  const userType = (user?.type || "User").toUpperCase();
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
      </div>
    </header>
  );
}

export default Header;
