import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../store/authentication.thunks.js";

import {
  selectAuthenticationStatus,
  selectAuthenticationError,
} from "../../store/authentication.selectors.js";

import Input from "../../../../components/common/form/input/Input.jsx";
import Checkbox from "../../../../components/common/form/checkbox/Checkbox.jsx";
import Button from "../../../../components/common/button/Button.jsx";

import { useToast } from "../../../../components/common/toast/ToastProvider.jsx";


function Login() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const status = useSelector(selectAuthenticationStatus);
  const error = useSelector(selectAuthenticationError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(
      login({
        email: formData.email.trim(),
        password: formData.password,
      }),
    );

    if (login.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Login Successful",
        message: "Welcome back.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Login Failed",
      message: result?.payload || error || "Invalid email or password.",
    });
  };

  const isLoading = status === "loading";

  return (
    <section className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>

            <p>Sign in to your Embex360 account.</p>
          </div>

          <form id="login-form" className="login-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={formErrors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={formErrors.password}
              disabled={isLoading}
            />

            <div className="login-options">
              <Checkbox
                name="rememberMe"
                label="Remember me"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
              />

              <button
                type="button"
                className="login-forgot-button"
                onClick={() => {
                  // Forgot password flow will be connected later.
                }}
              >
                Forgot Password?
              </button>
            </div>

            <Button type="submit" form="login-form" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
