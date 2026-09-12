import SidebarHeader from "./components/SidebarHeader";
import SidebarFooter from "./components/SidebarFooter";
import "./sidebar.scss";

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <SidebarHeader />

      <div className="app-sidebar__content" />

      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;
