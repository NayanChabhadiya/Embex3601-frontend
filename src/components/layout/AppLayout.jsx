import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import PageContainer from "./page/PageContainer";
import "./app-layout.scss";
import { Outlet } from "react-router-dom";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-layout__main">
        <Header />

        <main className="app-layout__content">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
