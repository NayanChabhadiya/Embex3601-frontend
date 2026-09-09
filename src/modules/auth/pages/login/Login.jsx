import { useState } from "react";

import { Checkbox } from "../../../../components/common/form/checkbox";
import { Input } from "../../../../components/common/form/input";

import "./login.scss";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(formData);
  };

  return (
    <main className="login-page">
      <section className="login-page__showcase">
        <div className="login-page__brand">
          <span className="login-page__brand-mark">E</span>

          <span>Embex360</span>
        </div>

        <div className="login-page__content">
          <div className="login-page__eyebrow">Enterprise ERP Platform</div>

          <h2 className="login-page__title">
            Run your business.
            <br />
            Your way.
          </h2>

          <p className="login-page__description">
            Manage companies, finance, inventory, sales, purchases and
            operations from one powerful workspace.
          </p>

          <div className="login-page__features">
            <div className="login-page__feature">
              <div className="login-page__feature-title">Multi Company</div>

              <div className="login-page__feature-text">
                Manage multiple businesses from one place.
              </div>
            </div>

            <div className="login-page__feature">
              <div className="login-page__feature-title">Smart Operations</div>

              <div className="login-page__feature-text">
                Keep your daily business operations connected.
              </div>
            </div>

            <div className="login-page__feature">
              <div className="login-page__feature-title">Secure & Scalable</div>

              <div className="login-page__feature-text">
                Built for growing modern businesses.
              </div>
            </div>
          </div>
        </div>

        <div className="login-page__footer">
          © 2026 Embex360. All rights reserved.
        </div>
      </section>

      <section className="login-page__form-side">
        <div className="login-page__card">
          <div className="login-page__welcome">
            <h1>Welcome back</h1>

            <p>Sign in to continue to your Embex360 workspace.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <div className="login-form__options">
              <Checkbox
                label="Remember me"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />

              <button type="button" className="login-form__forgot">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-form__submit">
              Sign in
            </button>

            <div className="login-form__divider">
              <span>or continue with</span>
            </div>

            <div className="login-form__social">
              <button type="button" className="login-form__social-button">
                Google
              </button>

              <button type="button" className="login-form__social-button">
                Microsoft
              </button>
            </div>
          </form>

          <div className="login-form__help">
            Need help? <a href="mailto:support@embex360.com">Contact support</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
