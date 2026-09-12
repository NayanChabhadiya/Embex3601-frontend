import { useEffect, useState } from "react";
import SidebarHeader from "./components/SidebarHeader";
import SidebarFooter from "./components/SidebarFooter";
import "./sidebar.scss";
import { NavLink, useLocation } from "react-router-dom";
import { SIDEBAR_MENU } from "./config/sidebar-menu";
import SidebarIcon from "./components/SidebarIcon";
import { isSidebarSectionActive } from "./utils/is-sidebar-section-active";

function Sidebar() {
  const menuItems = SIDEBAR_MENU;
  const location = useLocation();

  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(
      SIDEBAR_MENU.filter((item) => item.children?.length).map((item) => [
        item.key,
        true,
      ]),
    ),
  );

  const toggleSection = (key) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  useEffect(() => {
    const activeSections = menuItems
      .filter(
        (item) =>
          item.children?.length &&
          isSidebarSectionActive(item.children, location.pathname),
      )
      .map((item) => item.key);

    if (activeSections.length === 0) {
      return;
    }

    setOpenSections((current) => ({
      ...current,
      ...Object.fromEntries(activeSections.map((key) => [key, true])),
    }));
  }, [location.pathname, menuItems]);
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
                        end={child.path === "/"}
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
