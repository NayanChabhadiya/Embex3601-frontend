import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import SidebarHeader from "./components/SidebarHeader";
import SidebarFooter from "./components/SidebarFooter";
import SidebarIcon from "./components/SidebarIcon";

import "./sidebar.scss";

import { SIDEBAR_MENU } from "./config/sidebar-menu";
import { isSidebarSectionActive } from "./utils/is-sidebar-section-active";
import { filterSidebarMenu } from "./utils/filter-sidebar-menu";

import { selectCurrentUser } from "../../../modules/identity/auth/store/authentication.selectors.js";
import AUTHENTICATION_CONSTANTS from "../../../modules/identity/auth/constants/authentication.constants.js";

function Sidebar() {
  const location = useLocation();

  // ---------------------------------------------------------------------------
  // Current User
  // ---------------------------------------------------------------------------

  const currentUser = useSelector(selectCurrentUser);

  // ---------------------------------------------------------------------------
  // Platform Admin Access
  // ---------------------------------------------------------------------------

  const isPlatformAdmin =
    currentUser?.type === AUTHENTICATION_CONSTANTS.USER_TYPES.PLATFORM_ADMIN;

  // ---------------------------------------------------------------------------
  // Filter Sidebar Menu
  // ---------------------------------------------------------------------------

  const menuItems = useMemo(
    () => filterSidebarMenu(SIDEBAR_MENU, [], isPlatformAdmin),
    [isPlatformAdmin],
  );

  // ---------------------------------------------------------------------------
  // Open Sections
  // ---------------------------------------------------------------------------

  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(
      menuItems
        .filter((item) => item.children?.length)
        .map((item) => [item.key, true]),
    ),
  );

  // ---------------------------------------------------------------------------
  // Toggle Section
  // ---------------------------------------------------------------------------

  const toggleSection = (key) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  // ---------------------------------------------------------------------------
  // Sync Sections With Menu
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setOpenSections((current) => {
      const next = Object.fromEntries(
        menuItems
          .filter((item) => item.children?.length)
          .map((item) => [item.key, current[item.key] ?? true]),
      );

      return next;
    });
  }, [menuItems]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <aside className="app-sidebar">
      <SidebarHeader />

      <nav className="app-sidebar__content">
        {menuItems.map((item) => {
          if (item.type === "group" && item.children?.length) {
            return (
              <div key={item.key} className="app-sidebar__menu-section">
                <button
                  type="button"
                  className={`app-sidebar__menu-section-title ${
                    isSidebarSectionActive(item.children, location.pathname)
                      ? "app-sidebar__menu-section-title--active"
                      : ""
                  }`}
                  onClick={() => toggleSection(item.key)}
                >
                  <span>{item.label}</span>

                  <span
                    className={`app-sidebar__menu-section-arrow ${
                      openSections[item.key]
                        ? "app-sidebar__menu-section-arrow--open"
                        : ""
                    }`}
                  >
                    ›
                  </span>
                </button>

                {openSections[item.key] && (
                  <div className="app-sidebar__menu-items">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.key}
                        to={child.path}
                        end
                        className={({ isActive }) =>
                          `app-sidebar__menu-item ${
                            isActive ? "app-sidebar__menu-item--active" : ""
                          }`
                        }
                      >
                        <SidebarIcon name={child.icon} />

                        <span className="app-sidebar__menu-label">
                          {child.label}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `app-sidebar__menu-item ${
                  isActive ? "app-sidebar__menu-item--active" : ""
                }`
              }
            >
              <SidebarIcon name={item.icon} />

              <span className="app-sidebar__menu-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;
