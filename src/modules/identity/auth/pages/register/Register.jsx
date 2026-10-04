import { useState } from "react";

import Input from "../../../../../components/common/form/input/Input";
import Button from "../../../../../components/common/button/Button";

import useAuthentication from "../../hooks/useAuthentication.js";
import AUTHENTICATION_VALIDATION from "../../validations/authentication.validation.js";
import AUTH_MESSAGES from "../../constants/authentication.messages.js";

import "./register.scss";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { register, isLoading } = useAuthentication();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setRegistrationSuccess(false);

    const validationErrors =
      AUTHENTICATION_VALIDATION.validateRegister(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      password: formData.password,
    };

    const result = await register(payload);

    if (!result.success) {
      setErrors({
        form: result.error || AUTH_MESSAGES.REGISTRATION_FAILED,
      });

      return;
    }

    setRegisteredEmail(formData.email.trim());
    setRegistrationSuccess(true);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});
  };

  if (registrationSuccess) {
    return (
      <div className="register-page">
        <div className="register-card">
          <section className="register-card__intro">
            <div className="register-card__brand">
              <div className="register-card__brand-mark">E</div>

              <span className="register-card__brand-name">
                EMBEX<span>360</span>
              </span>
            </div>

            <div className="register-card__intro-content">
              <span className="register-card__eyebrow">ACCOUNT CREATED</span>

              <h1>
                Welcome to
                <span> EMBEX360.</span>
              </h1>

              <p>
                Your account has been created successfully. One more step is
                required before you can sign in.
              </p>

              <div className="register-card__highlights">
                <div className="register-card__highlight">
                  <div className="register-card__highlight-icon">✓</div>

                  <div>
                    <strong>Account created</strong>
                    <span>Your EMBEX360 customer account is ready.</span>
                  </div>
                </div>

                <div className="register-card__highlight">
                  <div className="register-card__highlight-icon">✉</div>

                  <div>
                    <strong>Verify your email</strong>
                    <span>
                      Check your inbox and click the verification link.
                    </span>
                  </div>
                </div>

                <div className="register-card__highlight">
                  <div className="register-card__highlight-icon">→</div>

                  <div>
                    <strong>Then sign in</strong>
                    <span>
                      After verification, you can access your account.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="register-card__intro-footer">
              <span>© EMBEX360</span>
              <span>Enterprise Business Management</span>
            </div>
          </section>

          <section className="register-card__form-wrapper">
            <div className="register-form">
              <div className="register-form__header">
                <span className="register-form__welcome">
                  REGISTRATION COMPLETE
                </span>

                <h2>Verify your email</h2>

                <p>{AUTH_MESSAGES.REGISTRATION_SUCCESS}</p>
              </div>

              <div className="register-form__terms">
                <strong>{registeredEmail}</strong>

                <span>
                  We have sent a verification link to this email address. Please
                  check your inbox and follow the instructions to activate your
                  account.
                </span>
              </div>

              <div className="register-form__terms">
                <span>
                  If you do not see the email, please check your spam or junk
                  folder.
                </span>
              </div>

              <Button
                type="button"
                className="register-form__submit"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Go to Sign In
              </Button>

              <div className="register-form__login">
                <span>Already verified your email?</span>

                <button
                  type="button"
                  className="register-form__login-link"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <section className="register-card__intro">
          <div className="register-card__brand">
            <div className="register-card__brand-mark">E</div>

            <span className="register-card__brand-name">
              EMBEX<span>360</span>
            </span>
          </div>

          <div className="register-card__intro-content">
            <span className="register-card__eyebrow">
              BUSINESS MANAGEMENT PLATFORM
            </span>

            <h1>
              Build your business
              <span> with confidence.</span>
            </h1>

            <p>
              Create your EMBEX360 account and manage your business operations
              from one powerful platform.
            </p>

            <div className="register-card__highlights">
              <div className="register-card__highlight">
                <div className="register-card__highlight-icon">✓</div>

                <div>
                  <strong>One powerful workspace</strong>
                  <span>Manage your business operations in one place.</span>
                </div>
              </div>

              <div className="register-card__highlight">
                <div className="register-card__highlight-icon">✓</div>

                <div>
                  <strong>Multi-company ready</strong>
                  <span>Manage multiple companies under your account.</span>
                </div>
              </div>

              <div className="register-card__highlight">
                <div className="register-card__highlight-icon">✓</div>

                <div>
                  <strong>Secure by design</strong>
                  <span>Your account and business data stay protected.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="register-card__intro-footer">
            <span>© EMBEX360</span>
            <span>Enterprise Business Management</span>
          </div>
        </section>

        <section className="register-card__form-wrapper">
          <div className="register-form">
            <div className="register-form__header">
              <span className="register-form__welcome">GET STARTED</span>

              <h2>Create your account</h2>

              <p>
                Enter your details to create your EMBEX360 customer account.
              </p>
            </div>

            {errors.form && (
              <div className="register-form__terms">
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-form__section">
                <div className="register-form__section-title">
                  Personal Information
                </div>

                <div className="register-form__row">
                  <div className="register-form__field">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      error={errors.firstName}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="register-form__field">
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      error={errors.lastName}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="register-form__row">
                  <div className="register-form__field">
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      error={errors.email}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="register-form__field">
                    <Input
                      label="Mobile Number"
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      error={errors.mobile}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="register-form__section">
                <div className="register-form__section-title">
                  Account Security
                </div>

                <div className="register-form__row">
                  <div className="register-form__field">
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      error={errors.password}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="register-form__field">
                    <Input
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      error={errors.confirmPassword}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="register-form__terms">
                <span>
                  By creating an account, you agree to the EMBEX360 terms and
                  conditions and acknowledge our privacy policy.
                </span>
              </div>

              <Button
                type="submit"
                className="register-form__submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="register-form__login">
              <span>Already have an account?</span>

              <button
                type="button"
                className="register-form__login-link"
                onClick={() => {
                  window.location.href = "/login";
                }}
                disabled={isLoading}
              >
                Sign In
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
