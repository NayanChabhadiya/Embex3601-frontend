import "./header.scss";

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-header__title">Embex360</span>
      </div>

      <div className="app-header__right">
        <span className="app-header__account">Account</span>
      </div>
    </header>
  );
}

export default Header;
