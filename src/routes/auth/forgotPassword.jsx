import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.scss";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../store/apiSlice/authSlice";
import { useToast } from "../../contexts/toastContext/toastContext";
import { startLoading, stopLoading } from "../../store/apiSlice/componentSlice";
import logo from "../../assets/logo/Logo_1.png";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
  });
  const handleChangeForgotPasswordData = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotPassword = (e) => {
    if (!forgotPasswordData.email) {
      showToast("Please enter your email.", "error");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordData.email)) {
      showToast("Please enter a valid email.", "error");
    } else {
      dispatch(startLoading());
      dispatch(forgotPassword(forgotPasswordData))
        .then((res) => {
          if (res.payload?.message === "User not found") {
            dispatch(stopLoading());
            showToast("This email is not registered", "error");
          } else if (res.payload?.success) {
            dispatch(stopLoading());
            showToast("OTP sent successfully", "success");
            navigate("/reset-password", {
              state: { email: forgotPasswordData.email },
            });
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
        <h1>Reset Password</h1>
        <p>Enter your registered email to receive reset instructions.</p>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>Forgot Password</h2>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={forgotPasswordData.email}
              onChange={handleChangeForgotPasswordData}
            />
          </div>
          <button className="btn-primary" onClick={handleForgotPassword}>
            Send Reset Link
          </button>
          <p className="switch-link">
            Back to <Link to="/login">Login</Link>
          </p>
          <p className="switch-link">
            Reset Password? <Link to="/reset-password">Reset Password</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
