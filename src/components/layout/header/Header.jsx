import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../../modules/auth/store/auth.thunks.js";
import { resetPlatformAdmin } from "../../../modules/platform-admin/store/platform-admin.slice.js";
import "./header.scss";
import { selectPlatformAdminAccess } from "../../../modules/platform-admin/store/platform-admin.selectors.js";
import Badge from "../../common/badge/Badge.jsx";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user);
  const platformAdminAccess = useSelector(selectPlatformAdminAccess);

  const platformAdminRole = platformAdminAccess?.role
    ? platformAdminAccess.role.replace(/_/g, " ").toUpperCase()
    : null;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } finally {
      dispatch(resetPlatformAdmin());
      navigate("/login", { replace: true });
    }
  };

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

            {platformAdminRole && (
              <Badge variant="primary">{platformAdminRole}</Badge>
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
