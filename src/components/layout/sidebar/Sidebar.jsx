import SidebarHeader from "./components/SidebarHeader";
import SidebarFooter from "./components/SidebarFooter";
import "./sidebar.scss";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { SIDEBAR_MENU } from "./config/sidebar-menu";
import { filterSidebarMenu } from "./utils/filter-sidebar-menu";

function Sidebar() {
  // const permissions = useSelector((state) => state.auth.permissions);
  // const menuItems = filterSidebarMenu(SIDEBAR_MENU, permissions);
  const menuItems = SIDEBAR_MENU;
  return (
    <aside className="app-sidebar">
      <SidebarHeader />

      <nav className="app-sidebar__content">
        {menuItems.map((item) => {
          if (item.children?.length) {
            return (
              <div key={item.key} className="app-sidebar__menu-section">
                <span className="app-sidebar__menu-section-title">
                  {item.label}
                </span>

                <div className="app-sidebar__menu-items">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.key}
                      to={child.path}
                      className={({ isActive }) =>
                        `app-sidebar__menu-item ${
                          isActive ? "app-sidebar__menu-item--active" : ""
                        }`
                      }
                    >
                      <span className="app-sidebar__menu-label">
                        {child.label}
                      </span>
                    </NavLink>
                  ))}
                </div>
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
