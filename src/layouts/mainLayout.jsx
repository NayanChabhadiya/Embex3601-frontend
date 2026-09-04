import "../assets/styles/main.scss";
import Header from "../components/layouts/header/header";
import Sidebar from "../components/layouts/sidebar/sidebar";
import Footer from "../components/layouts/footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/apiSlice/componentSlice";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../components/breadcrumb/breadcrumb";

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.components.isSidebarOpen);
  const location = useLocation();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const breadcrumbItems = [
    "Home",
    ...location.pathname
      ?.split("/")
      ?.filter((segment) => segment)
      ?.map(
        (segment) =>
          segment.charAt(0).toUpperCase() + segment?.slice(1).replace(/-/g, " ")
      ),
  ];
  return (
    <div className="layout">
      <Sidebar />
      <Header toggleSidebar={handleToggleSidebar} />
      <main className={`main-content ${isSidebarOpen ? "expanded" : ""}`}>
        <div className="breadcrumb">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="sub-content">{children}</div>
      </main>

      <Footer />
    </div>
 
  );
};

export default MainLayout;
