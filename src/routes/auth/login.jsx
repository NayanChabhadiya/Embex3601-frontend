import "./auth.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "../../store/apiSlice/authSlice";
import { useToast } from "../../contexts/toastContext/toastContext";
import { startLoading, stopLoading } from "../../store/apiSlice/componentSlice";
import logo from "../../assets/logo/Logo_1.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    if (!loginData.email) {
      showToast("Please enter your email.", "error");
      return;
    } else if (!loginData.password) {
      showToast("Please enter your password.", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(logIn(loginData))
        .then((res) => {
          if (res?.payload?.message === "Email or password is wrong") {
            dispatch(stopLoading());
            showToast("Email or password is incorrect", "error");
          } else if (res?.payload?.message === "Email is not verified.") {
            dispatch(stopLoading());
            showToast("Please verify your email before logging in.", "error");
          } else if (res?.payload?.success) {
            setLoginData({});
            dispatch(stopLoading());
            showToast("Login successful", "success");
            navigate("/");
          } else {
            dispatch(stopLoading());
            showToast("Something went wrong, please try again later.", "error");
          }
        })
        .catch((error) => {
          dispatch(stopLoading());
          showToast("Something went wrong, please try again later.", "error");
        });
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="Company Logo" className="auth-logo" />
        <h1>Welcome Back!</h1>
        <p>Please login to continue</p>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>Login</h2>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChangeData}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChangeData}
                placeholder="Enter your password"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
          <p className="switch-link">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
          <p className="switch-link">
            Forgot your password? <Link to="/forgot-password">Reset it</Link>
          </p>
          <p className="switch-link">
            Need to verify your email?{" "}
            <Link to="/verification">Verify here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
