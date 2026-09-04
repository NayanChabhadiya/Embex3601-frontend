import { useDispatch, useSelector } from "react-redux";
import {
  setSidebar,
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import profileImg from "../../../assets/icons/profile-2.png";
import { logoutUser } from "../../../store/apiSlice/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Menuitems from "./menuItems";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { FcCancel } from "react-icons/fc";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const subscriptionPlan = user?.subscriptionPlan;
  const filteredMenuItems = Menuitems?.filter((menuItem) =>
    menuItem.allowedPlans.includes(subscriptionPlan)
  );

  const isSidebarOpen = useSelector((state) => state.components.isSidebarOpen);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      for (const item of filteredMenuItems) {
        if (
          item.subMenu &&
          item.subMenu.some((subItem) => subItem.path === pathname)
        ) {
          setIsSubMenuOpen(item.name);
          break;
        }
      }
      setIsInitialLoad(false);
    }
  }, [pathname, filteredMenuItems, isInitialLoad]);

  const toggleSubMenu = (menuName) => {
    setIsSubMenuOpen((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <button
        className="sidebar-close-btn"
        onClick={() => dispatch(setSidebar(false))}
      >
        &times;
      </button>

      <div className="profile">
        <img src={profileImg} alt="User Profile" />
        <div className="name">{user?.firstName + " " + user?.lastName}</div>
        <div className="role">{subscriptionPlan}</div>
      </div>

      <nav className="menu">
        {filteredMenuItems?.map((item) => {
          const isActiveSubmenu =
            item.subMenu &&
            item.subMenu.some((subItem) => subItem.path === pathname);

          return (
            <div key={item.name}>
              <div
                className={`menu-item ${
                  pathname === item.path || isActiveSubmenu ? "active" : ""
                }`}
                onClick={() => {
                  if (item.subMenu) {
                    setIsSubMenuOpen((prev) =>
                      prev === item.name ? null : item.name
                    );
                  } else {
                    setIsSubMenuOpen(null);
                    navigate(item.path);
                  }
                }}
              >
                <item.icon className="menu-icon" />
                <span>{item.name}</span>
                {item.subMenu && (
                  <FaAngleLeft
                    className={`submenu-arrow ${
                      isSubMenuOpen === item.name ? "open" : ""
                    }`}
                  />
                )}
              </div>

              {item.subMenu && (
                <div
                  className={`submenu ${
                    isSubMenuOpen === item.name ? "open" : ""
                  }`}
                >
                  {item.subMenu?.map((subItem) => (
                    <div
                      key={subItem.name}
                      className={`submenu-item ${
                        pathname === subItem.path ? "active" : ""
                      }`}
                      onClick={() => {
                        setIsSubMenuOpen(item.name);
                        navigate(subItem.path);
                      }}
                    >
                      {subItem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div
          className="menu-item"
          onClick={() => {
            dispatch(logoutUser());
            showToast("Logged out successfully", "success");
          }}
        >
          <FcCancel  className="menu-icon" />
          <span>Log out</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
