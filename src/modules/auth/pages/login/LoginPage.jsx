import "./login-page.scss";

const LoginPage = () => {
  return (
    <main className="login-page">
      <section className="login-page__layout">
        {/* ============================================================
            LEFT BRAND PANEL
           ============================================================ */}
        <div className="login-page__brand-panel">
          <div className="login-page__brand-content">
            <a
              className="login-page__brand"
              href="/"
              aria-label="Embex360 home"
            >
              <span className="login-page__brand-mark">E</span>

              <span className="login-page__brand-info">
                <span className="login-page__brand-name">EMBEX360</span>

                <span className="login-page__brand-caption">
                  BUSINESS MANAGEMENT PLATFORM
                </span>
              </span>
            </a>

            <div className="login-page__brand-message">
              <span className="login-page__eyebrow">WELCOME BACK</span>

              <h1>
                Run your business
                <span>with confidence.</span>
              </h1>

              <p>
                Manage companies, invoices, inventory, users, reports and daily
                operations from one powerful business platform.
              </p>
            </div>

            <div className="login-page__highlights">
              <div className="login-page__highlight">
                <span className="login-page__highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 3l7 3v5c0 4.5-2.9 8.4-7 10-4.1-1.6-7-5.5-7-10V6l7-3z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span>
                  <strong>Secure by design</strong>
                  <small>Your business data stays protected.</small>
                </span>
              </div>

              <div className="login-page__highlight">
                <span className="login-page__highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M3 9h18M8 4v5M16 4v5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                <span>
                  <strong>One platform</strong>
                  <small>Everything your business needs in one place.</small>
                </span>
              </div>
            </div>
          </div>

          <div className="login-page__brand-footer">
            <span>© 2026 Embex360</span>
            <span>Enterprise Business Management</span>
          </div>
        </div>

        {/* ============================================================
            LOGIN PANEL
           ============================================================ */}
        <div className="login-page__form-panel">
          <div className="login-page__form-wrapper">
            <div className="login-page__mobile-brand">
              <a
                className="login-page__brand"
                href="/"
                aria-label="Embex360 home"
              >
                <span className="login-page__brand-mark">E</span>

                <span className="login-page__brand-info">
                  <span className="login-page__brand-name">EMBEX360</span>

                  <span className="login-page__brand-caption">
                    BUSINESS MANAGEMENT PLATFORM
                  </span>
                </span>
              </a>
            </div>

            <div className="login-page__form-header">
              <span className="login-page__form-eyebrow">ACCOUNT ACCESS</span>

              <h2>Sign in to your account</h2>

              <p>
                Enter your credentials to continue to your Embex360 workspace.
              </p>
            </div>

            <form
              className="login-page__form"
              onSubmit={(event) => event.preventDefault()}
              noValidate
            >
              <div className="login-page__field">
                <label htmlFor="login-email">Email address</label>

                <div className="login-page__input-wrapper">
                  <span className="login-page__input-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M4 7l8 6 8-6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="login-page__field">
                <div className="login-page__field-header">
                  <label htmlFor="login-password">Password</label>

                  <button type="button" className="login-page__forgot">
                    Forgot password?
                  </button>
                </div>

                <div className="login-page__input-wrapper">
                  <span className="login-page__input-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect
                        x="4"
                        y="10"
                        width="16"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M8 10V7a4 4 0 018 0v3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="login-page__password-toggle"
                    aria-label="Show password"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <label className="login-page__remember">
                <input type="checkbox" name="remember" />

                <span className="login-page__checkbox">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12l4 4L19 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span>Keep me signed in</span>
              </label>

              <button type="submit" className="login-page__submit">
                <span>Sign in</span>

                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>

            <div className="login-page__security">
              <span className="login-page__security-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 3l7 3v5c0 4.5-2.9 8.4-7 10-4.1-1.6-7-5.5-7-10V6l7-3z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>Your connection is encrypted and securely protected.</span>
            </div>

            <div className="login-page__back">
              <a href="/">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M19 12H5M11 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Embex360
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
