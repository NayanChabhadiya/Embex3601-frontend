
const Layout = () => {
  return (
    <div
      className={`layout ${sidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}
    >
      <aside className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>Dashboard</li>
          <li>Users</li>
          <li>Settings</li>
        </ul>
      </aside>

      <header className="header">
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h1>Responsive Layout</h1>
      </header>

      <main className="content">{children}</main>

      <footer className="footer">&copy; 2025 Embex International</footer>
    </div>
  );
};

export default Layout;
