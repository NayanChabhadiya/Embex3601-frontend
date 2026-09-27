import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./header.scss";

import Badge from "../../common/badge/Badge.jsx";

import { logout } from "../../../modules/auth/store/authentication.thunks.js";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authentication?.user);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef(null);

  // ---------------------------------------------------------------------------
  // User Information
  // ---------------------------------------------------------------------------

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email ||
    "User";

  const userType = (user?.type || "User").toUpperCase();

  const userRole = user?.role
    ? user.role.replace(/_/g, " ").toUpperCase()
    : null;

  // ---------------------------------------------------------------------------
  // Close Account Menu On Outside Click
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------

  const handleProfile = () => {
    setIsAccountMenuOpen(false);
    navigate("/profile");
  };

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  const handleLogout = async () => {
    setIsAccountMenuOpen(false);

    try {
      await dispatch(logout()).unwrap();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);

      navigate("/login", {
        replace: true,
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Toggle Account Menu
  // ---------------------------------------------------------------------------

  const handleAccountMenuToggle = () => {
    setIsAccountMenuOpen((previous) => !previous);
  };

  return (
    <header className="app-header">
      {/* ------------------------------------------------------------------ */}
      {/* Left */}
      {/* ------------------------------------------------------------------ */}

      <div className="app-header__left">
        <span className="app-header__title">Embex360</span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right */}
      {/* ------------------------------------------------------------------ */}

      <div className="app-header__right">
        <div className="app-header__account" ref={accountMenuRef}>
          {/* -------------------------------------------------------------- */}
          {/* Account Trigger */}
          {/* -------------------------------------------------------------- */}

          <button
            type="button"
            className={`app-header__account-trigger ${
              isAccountMenuOpen ? "app-header__account-trigger--active" : ""
            }`}
            onClick={handleAccountMenuToggle}
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="menu"
          >
            <div className="app-header__avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="app-header__account-info">
              <strong>{displayName}</strong>

              {user?.email && <span>{user.email}</span>}

              <div className="app-header__badges">
                <Badge variant="neutral">{userType}</Badge>
              </div>
            </div>

            <span className="app-header__account-arrow">
              {isAccountMenuOpen ? "▲" : "▼"}
            </span>
          </button>

          {/* -------------------------------------------------------------- */}
          {/* Account Dropdown */}
          {/* -------------------------------------------------------------- */}

          {isAccountMenuOpen && (
            <div className="app-header__account-menu" role="menu">
              {/* User Summary */}

              <div className="app-header__menu-user">
                <div className="app-header__menu-avatar">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                <div className="app-header__menu-user-info">
                  <strong>{displayName}</strong>

                  {user?.email && <span>{user.email}</span>}

                  {userRole && <small>{userRole}</small>}
                </div>
              </div>

              <div className="app-header__menu-divider" />

              {/* Profile */}

              <button
                type="button"
                className="app-header__menu-item"
                onClick={handleProfile}
                role="menuitem"
              >
                <span className="app-header__menu-icon">👤</span>

                <span>Profile</span>
              </button>

              <div className="app-header__menu-divider" />

              {/* Logout */}

              <button
                type="button"
                className="app-header__menu-item app-header__menu-item--danger"
                onClick={handleLogout}
                role="menuitem"
              >
                <span className="app-header__menu-icon">↪</span>

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
