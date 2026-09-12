import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import "./app-layout.scss";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-layout__main">
        <Header />

        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
