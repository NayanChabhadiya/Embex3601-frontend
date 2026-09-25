import { useState } from "react";

import Input from "../../../../components/common/form/input/Input.jsx";
import Checkbox from "../../../../components/common/form/checkbox/Checkbox.jsx";
import Button from "../../../../components/common/button/Button.jsx";
import { useToast } from "../../../../components/common/toast/ToastProvider.jsx";

import useAuthentication from "../../hooks/useAuthentication.js";
import AUTHENTICATION_VALIDATION from "../../validations/authentication.validation.js";
import AUTH_MESSAGES from "../../constants/authentication.messages.js";

import "./login.scss";

function Login() {
  const { login, isLoading, error } = useAuthentication();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Handle Input Change
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // Handle Login
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = AUTHENTICATION_VALIDATION.validateLogin(formData);

    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const result = await login({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (result.success) {
      showToast({
        type: "success",
        title: "Login Successful",
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
      });

      return;
    }

    showToast({
      type: "error",
      title: "Login Failed",
      message: result.error || AUTH_MESSAGES.INVALID_CREDENTIALS,
    });
  };

  return (
    <main className="login-page">
      <div className="login-page__background">
        <div className="login-page__shape login-page__shape--one" />
        <div className="login-page__shape login-page__shape--two" />
        <div className="login-page__shape login-page__shape--three" />
      </div>

      <div className="login-page__container">
        <section className="login-card">
          {/* Brand / Intro */}
          <div className="login-card__intro">
            <div className="login-brand">
              <div className="login-brand__mark">E</div>

              <span className="login-brand__name">
                EMBEX<span>360</span>
              </span>
            </div>

            <div className="login-card__welcome">
              <span className="login-card__eyebrow">ACCOUNT ACCESS</span>

              <h1>Welcome back</h1>

              <p>Sign in to continue managing your business with Embex360.</p>
            </div>

            <div className="login-card__highlights">
              <div className="login-highlight">
                <span className="login-highlight__icon">✓</span>
                <span>Secure account access</span>
              </div>

              <div className="login-highlight">
                <span className="login-highlight__icon">✓</span>
                <span>Manage your business in one place</span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="login-card__form-section">
            <div className="login-form-header">
              <h2>Sign in</h2>

              <p>Enter your account credentials below.</p>
            </div>

            <form
              id="login-form"
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="login-form__field">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={formErrors.email}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div className="login-form__field">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={formErrors.password}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <div className="login-form__options">
                <Checkbox
                  name="rememberMe"
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="login-form__forgot"
                  disabled={isLoading}
                  onClick={() => {
                    // Forgot password flow will be connected later.
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                form="login-form"
                disabled={isLoading}
                loading={isLoading}
                loadingText="Signing in..."
                className="login-form__submit"
              >
                Sign in to Embex360
              </Button>
            </form>

            <div className="login-form__footer">
              <span>© {new Date().getFullYear()} Embex360</span>
              <span>Business Management Platform</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
