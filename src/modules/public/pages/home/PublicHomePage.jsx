import { useState } from "react";
import { Button, ScrollToTop } from "../../../../components/common";
import "./public-home.scss";

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </svg>
);

const BuildingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M16 9h3a1 1 0 0 1 1 1v11" />
    <path d="M8 7h4" />
    <path d="M8 11h4" />
    <path d="M8 15h4" />
    <path d="M8 19h4" />
    <path d="M2 21h20" />
  </svg>
);

const InvoiceIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Z" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
    <path d="M9 16h3" />
  </svg>
);

const InventoryIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="m4 7.5 8 4.5 8-4.5" />
    <path d="M12 12v9" />
    <path d="m8 5.2 8 4.6" />
  </svg>
);

const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8" />
    <path d="M17 14.5c2.2.8 4 2.9 4 5.5" />
  </svg>
);

const ChartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19V5" />
    <path d="M4 19h17" />
    <path d="m7 15 4-4 3 2 5-6" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const PublicHomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (sectionId) => {
    closeMenu();

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  const features = [
    {
      icon: <BuildingIcon />,
      title: "Multi-Company Management",
      description:
        "Manage multiple companies from one secure ERP platform without losing control of your individual business operations.",
    },
    {
      icon: <InvoiceIcon />,
      title: "Invoice & Billing",
      description:
        "Create professional invoices, manage payments, track outstanding amounts and keep your billing process organized.",
    },
    {
      icon: <InventoryIcon />,
      title: "Inventory Management",
      description:
        "Track products, stock movement and inventory information with a centralized operational workflow.",
    },
    {
      icon: <UsersIcon />,
      title: "Users & Roles",
      description:
        "Control team access with structured user management, permissions and role-based business operations.",
    },
    {
      icon: <ChartIcon />,
      title: "Reports & Insights",
      description:
        "Turn your business data into meaningful insights with centralized reports and operational visibility.",
    },
    {
      icon: <ShieldIcon />,
      title: "Secure & Reliable",
      description:
        "Built with security-first architecture to protect business information and provide dependable access.",
    },
  ];

  const plans = [
    {
      name: "Basic",
      price: "₹499",
      description: "For individuals and small businesses getting started.",
      features: [
        "1 Company",
        "3 Users",
        "Invoice Management",
        "Basic Reports",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      price: "₹999",
      description: "For growing businesses that need more flexibility.",
      popular: true,
      features: [
        "3 Companies",
        "10 Users",
        "Invoice Management",
        "Inventory Management",
        "Advanced Reports",
        "Priority Support",
      ],
    },
    {
      name: "Standard",
      price: "₹1,999",
      description: "For established businesses managing multiple operations.",
      features: [
        "10 Companies",
        "25 Users",
        "Complete ERP Modules",
        "Advanced Inventory",
        "Advanced Reports",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "₹4,999",
      description: "For organizations requiring scalable business operations.",
      features: [
        "Unlimited Companies",
        "Unlimited Users",
        "Complete ERP Modules",
        "Advanced Analytics",
        "Enterprise Security",
        "Dedicated Support",
      ],
    },
  ];

  return (
    <div className="public-home">
      <header className="public-home__header">
        <div className="public-home__header-inner">
          <button
            type="button"
            className="public-home__brand"
            onClick={() => handleNavClick("home")}
            aria-label="EMBEX360 home"
          >
            <span className="public-home__brand-mark">E</span>

            <span className="public-home__brand-content">
              <span className="public-home__brand-name">EMBEX360</span>
              <span className="public-home__brand-caption">
                BUSINESS MANAGEMENT
              </span>
            </span>
          </button>

          <nav
            className={`public-home__navigation ${
              isMenuOpen ? "public-home__navigation--open" : ""
            }`}
            aria-label="Main navigation"
          >
            <button
              type="button"
              className="public-home__nav-link public-home__nav-link--active"
              onClick={() => handleNavClick("home")}
            >
              Home
            </button>

            <button
              type="button"
              className="public-home__nav-link"
              onClick={() => handleNavClick("features")}
            >
              Features
            </button>

            <button
              type="button"
              className="public-home__nav-link"
              onClick={() => handleNavClick("pricing")}
            >
              Pricing
            </button>

            <button
              type="button"
              className="public-home__nav-link"
              onClick={() => handleNavClick("about")}
            >
              About
            </button>

            <button
              type="button"
              className="public-home__nav-link"
              onClick={() => handleNavClick("contact")}
            >
              Contact
            </button>

            <div className="public-home__mobile-actions">
              <Button
                variant="outline"
                size="medium"
                fullWidth
                onClick={handleLogin}
              >
                Sign In
              </Button>

              <Button
                variant="primary"
                size="medium"
                fullWidth
                icon={<ArrowRightIcon />}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </nav>

          <div className="public-home__header-actions">
            <Button variant="ghost" size="medium" onClick={handleLogin}>
              Sign In
            </Button>

            <Button
              variant="primary"
              size="medium"
              icon={<ArrowRightIcon />}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          <button
            type="button"
            className="public-home__menu-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="public-home__hero">
          <div className="public-home__hero-decoration public-home__hero-decoration--one" />
          <div className="public-home__hero-decoration public-home__hero-decoration--two" />

          <div className="public-home__container public-home__hero-grid">
            <div className="public-home__hero-content">
              <div className="public-home__eyebrow">
                <span className="public-home__eyebrow-dot" />
                ALL-IN-ONE ERP PLATFORM
              </div>

              <h1 className="public-home__hero-title">
                Manage.
                <span>Automate.</span>
                Grow.
              </h1>

              <p className="public-home__hero-description">
                EMBEX360 brings your entire business together in one powerful,
                secure and intelligent ERP platform. Manage companies, users,
                invoices, inventory, reports and more from one place.
              </p>

              <div className="public-home__hero-actions">
                <Button
                  variant="primary"
                  size="large"
                  icon={<ArrowRightIcon />}
                  onClick={handleGetStarted}
                >
                  Get Started Free
                </Button>

                <Button
                  variant="outline"
                  size="large"
                  icon={<ArrowUpRightIcon />}
                  onClick={() => handleNavClick("features")}
                >
                  Explore Platform
                </Button>
              </div>

              <div className="public-home__hero-trust">
                <div className="public-home__trust-item">
                  <CheckIcon />
                  No credit card required
                </div>

                <div className="public-home__trust-item">
                  <CheckIcon />
                  Secure cloud platform
                </div>

                <div className="public-home__trust-item">
                  <CheckIcon />
                  Built for growing businesses
                </div>
              </div>
            </div>

            <div className="public-home__dashboard-wrapper">
              <div className="public-home__dashboard-glow" />

              <div className="public-home__dashboard">
                <div className="public-home__dashboard-topbar">
                  <div className="public-home__dashboard-brand">
                    <span className="public-home__dashboard-brand-icon">E</span>

                    <span>EMBEX360</span>
                  </div>

                  <div className="public-home__dashboard-search">
                    <span>Search anything...</span>
                  </div>

                  <div className="public-home__dashboard-user">
                    <span className="public-home__dashboard-avatar">NC</span>
                  </div>
                </div>

                <div className="public-home__dashboard-body">
                  <aside className="public-home__dashboard-sidebar">
                    <span className="public-home__sidebar-label">
                      WORKSPACE
                    </span>

                    <div className="public-home__sidebar-item public-home__sidebar-item--active">
                      <span>▦</span>
                      Dashboard
                    </div>

                    <div className="public-home__sidebar-item">
                      <span>▤</span>
                      Invoices
                    </div>

                    <div className="public-home__sidebar-item">
                      <span>□</span>
                      Inventory
                    </div>

                    <div className="public-home__sidebar-item">
                      <span>♙</span>
                      Customers
                    </div>

                    <div className="public-home__sidebar-item">
                      <span>◫</span>
                      Reports
                    </div>
                  </aside>

                  <div className="public-home__dashboard-main">
                    <div className="public-home__dashboard-heading">
                      <div>
                        <span className="public-home__dashboard-overline">
                          BUSINESS OVERVIEW
                        </span>
                        <h3>Good morning, Nayan</h3>
                      </div>

                      <span className="public-home__dashboard-date">
                        September 2026
                      </span>
                    </div>

                    <div className="public-home__dashboard-stats">
                      <div className="public-home__dashboard-stat">
                        <span>Total Revenue</span>
                        <strong>₹24.8L</strong>
                        <small>↑ 18.4%</small>
                      </div>

                      <div className="public-home__dashboard-stat">
                        <span>Total Invoices</span>
                        <strong>1,248</strong>
                        <small>↑ 12.8%</small>
                      </div>

                      <div className="public-home__dashboard-stat">
                        <span>Pending</span>
                        <strong>₹4.2L</strong>
                        <small>↓ 8.2%</small>
                      </div>
                    </div>

                    <div className="public-home__dashboard-panels">
                      <div className="public-home__dashboard-chart">
                        <div className="public-home__panel-header">
                          <div>
                            <span>Revenue Overview</span>
                            <strong>₹24,80,000</strong>
                          </div>

                          <span className="public-home__panel-period">
                            This Year
                          </span>
                        </div>

                        <div className="public-home__chart">
                          <div className="public-home__chart-grid">
                            <span />
                            <span />
                            <span />
                            <span />
                          </div>

                          <svg
                            viewBox="0 0 500 180"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M0 145 C40 132 65 140 95 116 C125 92 143 111 174 93 C205 75 224 84 254 62 C285 40 306 61 336 48 C368 34 387 43 415 27 C447 10 470 23 500 8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />

                            <path
                              d="M0 145 C40 132 65 140 95 116 C125 92 143 111 174 93 C205 75 224 84 254 62 C285 40 306 61 336 48 C368 34 387 43 415 27 C447 10 470 23 500 8 L500 180 L0 180 Z"
                              fill="currentColor"
                              opacity="0.08"
                              stroke="none"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="public-home__dashboard-distribution">
                        <div className="public-home__panel-header">
                          <span>Companies</span>
                          <span className="public-home__panel-more">•••</span>
                        </div>

                        <div className="public-home__distribution-ring">
                          <div className="public-home__distribution-ring-inner">
                            <strong>08</strong>
                            <span>Companies</span>
                          </div>
                        </div>

                        <div className="public-home__distribution-list">
                          <span>
                            <i />
                            Active
                          </span>

                          <span>
                            <i />
                            Growing
                          </span>

                          <span>
                            <i />
                            New
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="public-home__dashboard-bottom">
                      <div>
                        <span>Recent Activity</span>
                        <strong>Invoice #INV-2026-01248 created</strong>
                      </div>

                      <span className="public-home__activity-status">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="public-home__metrics">
          <div className="public-home__container public-home__metrics-grid">
            <div className="public-home__metric">
              <strong>250+</strong>
              <span>Businesses</span>
            </div>

            <div className="public-home__metric">
              <strong>1,200+</strong>
              <span>Active Users</span>
            </div>

            <div className="public-home__metric">
              <strong>99.9%</strong>
              <span>Platform Uptime</span>
            </div>

            <div className="public-home__metric">
              <strong>15+</strong>
              <span>Countries</span>
            </div>
          </div>
        </section>

        <section id="features" className="public-home__section">
          <div className="public-home__container">
            <div className="public-home__section-heading">
              <span className="public-home__section-eyebrow">
                POWERFUL FEATURES
              </span>

              <h2>
                Everything your business needs.
                <span>One intelligent platform.</span>
              </h2>

              <p>
                Replace disconnected tools with one centralized ERP platform
                designed to simplify your daily business operations.
              </p>
            </div>

            <div className="public-home__features-grid">
              {features.map((feature) => (
                <article
                  className="public-home__feature-card"
                  key={feature.title}
                >
                  <div className="public-home__feature-icon">
                    {feature.icon}
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <button
                    type="button"
                    className="public-home__feature-link"
                    onClick={() => handleGetStarted()}
                  >
                    Explore feature
                    <ArrowRightIcon />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="public-home__about">
          <div className="public-home__container public-home__about-grid">
            <div className="public-home__about-content">
              <span className="public-home__section-eyebrow">
                BUILT FOR BUSINESS
              </span>

              <h2>
                Your business is growing.
                <span>Your software should grow with it.</span>
              </h2>

              <p>
                EMBEX360 is designed around the way modern businesses operate.
                Whether you manage one company or multiple businesses, the
                platform gives you a centralized environment to manage your
                operations with clarity and control.
              </p>

              <div className="public-home__about-points">
                <div>
                  <span className="public-home__about-check">
                    <CheckIcon />
                  </span>

                  <div>
                    <strong>Centralized business operations</strong>
                    <p>
                      Keep important business activities organized in one
                      connected platform.
                    </p>
                  </div>
                </div>

                <div>
                  <span className="public-home__about-check">
                    <CheckIcon />
                  </span>

                  <div>
                    <strong>Scalable architecture</strong>
                    <p>
                      Start small and expand your companies, teams and
                      operations as your business grows.
                    </p>
                  </div>
                </div>

                <div>
                  <span className="public-home__about-check">
                    <CheckIcon />
                  </span>

                  <div>
                    <strong>Security-first approach</strong>
                    <p>
                      Business information is handled through structured access
                      and secure application architecture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="public-home__about-visual">
              <div className="public-home__about-card public-home__about-card--main">
                <span className="public-home__about-card-label">
                  BUSINESS CONTROL
                </span>

                <strong>One platform.</strong>
                <strong>Every operation.</strong>

                <div className="public-home__about-progress">
                  <span />
                </div>

                <div className="public-home__about-card-footer">
                  <span>Operational efficiency</span>
                  <strong>94%</strong>
                </div>
              </div>

              <div className="public-home__about-card public-home__about-card--small">
                <span>ACTIVE COMPANIES</span>
                <strong>08</strong>
                <small>+2 this month</small>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="public-home__section public-home__pricing"
        >
          <div className="public-home__container">
            <div className="public-home__section-heading">
              <span className="public-home__section-eyebrow">
                SIMPLE PRICING
              </span>

              <h2>
                Choose the plan that
                <span>fits your business.</span>
              </h2>

              <p>
                Start with what you need today and upgrade whenever your
                business requires more.
              </p>
            </div>

            <div className="public-home__pricing-grid">
              {plans.map((plan) => (
                <article
                  className={`public-home__pricing-card ${
                    plan.popular ? "public-home__pricing-card--popular" : ""
                  }`}
                  key={plan.name}
                >
                  {plan.popular && (
                    <span className="public-home__pricing-badge">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="public-home__pricing-header">
                    <span className="public-home__pricing-name">
                      {plan.name}
                    </span>

                    <p>{plan.description}</p>

                    <div className="public-home__pricing-price">
                      <strong>{plan.price}</strong>
                      <span>/month</span>
                    </div>
                  </div>

                  <div className="public-home__pricing-divider" />

                  <ul className="public-home__pricing-features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <span>
                          <CheckIcon />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    size="large"
                    fullWidth
                    icon={<ArrowRightIcon />}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-home__cta">
          <div className="public-home__cta-shape public-home__cta-shape--one" />
          <div className="public-home__cta-shape public-home__cta-shape--two" />

          <div className="public-home__container public-home__cta-inner">
            <div>
              <span className="public-home__section-eyebrow">
                READY TO GET STARTED?
              </span>

              <h2>
                Build a smarter business
                <span>with EMBEX360.</span>
              </h2>

              <p>
                Bring your companies, teams and business operations together
                with one powerful ERP platform.
              </p>
            </div>

            <div className="public-home__cta-action">
              <Button
                variant="primary"
                size="large"
                icon={<ArrowRightIcon />}
                onClick={handleGetStarted}
              >
                Start for Free
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="public-home__footer">
        <div className="public-home__container">
          <div className="public-home__footer-main">
            <div className="public-home__footer-brand">
              <button
                type="button"
                className="public-home__brand"
                onClick={() => handleNavClick("home")}
              >
                <span className="public-home__brand-mark">E</span>

                <span className="public-home__brand-content">
                  <span className="public-home__brand-name">EMBEX360</span>
                  <span className="public-home__brand-caption">
                    BUSINESS MANAGEMENT
                  </span>
                </span>
              </button>

              <p>
                A modern ERP platform designed to help businesses manage,
                automate and grow with confidence.
              </p>
            </div>

            <div className="public-home__footer-column">
              <span>Platform</span>

              <button type="button" onClick={() => handleNavClick("features")}>
                Features
              </button>

              <button type="button" onClick={() => handleNavClick("pricing")}>
                Pricing
              </button>

              <button type="button" onClick={handleGetStarted}>
                Get Started
              </button>
            </div>

            <div className="public-home__footer-column">
              <span>Company</span>

              <button type="button" onClick={() => handleNavClick("about")}>
                About
              </button>

              <button type="button" onClick={() => handleNavClick("contact")}>
                Contact
              </button>

              <button type="button">Privacy</button>
            </div>

            <div className="public-home__footer-column">
              <span>Account</span>

              <button type="button" onClick={handleLogin}>
                Sign In
              </button>

              <button type="button" onClick={handleGetStarted}>
                Create Account
              </button>
            </div>
          </div>

          <div className="public-home__footer-bottom">
            <span>
              © {new Date().getFullYear()} EMBEX360. All rights reserved.
            </span>

            <span>Enterprise Business Management Platform</span>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default PublicHomePage;
