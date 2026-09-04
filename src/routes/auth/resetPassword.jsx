import { useState, useRef } from "react";
import "./auth.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyForgotPasswordOtp } from "../../store/apiSlice/authSlice";
import { useToast } from "../../contexts/toastContext/toastContext";
import { startLoading, stopLoading } from "../../store/apiSlice/componentSlice";
import logo from "../../assets/logo/Logo_1.png";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [resetPasswordData, setResetPasswordData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChangeResetPasswordData = (e) => {
    setResetPasswordData({
      ...resetPasswordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setResetPasswordData({
        ...resetPasswordData,
        otp: newOtp.join(""),
      });
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      if (index > 0 && !value) {
        inputRefs.current[index - 1].focus();
      }
      if (index === 5 && value) {
        inputRefs.current[index].blur();
      }
    }
  };
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      } else {
        inputRefs.current[index].blur();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setResetPasswordData({
        ...resetPasswordData,
        otp: newOtp.join(""),
      });
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        inputRefs.current[0].focus();
      }
    }
  };

  const getOtpValue = () => otp.join("");

  const handleReset = (e) => {
    if (!resetPasswordData.email) {
      showToast("Email is required", "error");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetPasswordData.email)) {
      showToast("Please enter a valid email", "error");
      return;
    } else if (!resetPasswordData.otp || getOtpValue()?.length < 6) {
      showToast("OTP is required and must be 6 digits", "error");
      return;
    } else if (resetPasswordData.otp?.length < 6) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    } else if (!/^\d{6}$/.test(resetPasswordData.otp)) {
      showToast("OTP must contain only digits", "error");
      return;
    } else if (!resetPasswordData.password) {
      showToast("Password is required", "error");
      return;
    } else if (!resetPasswordData.confirmPassword) {
      showToast("Confirm Password is required", "error");
      return;
    } else if (
      resetPasswordData.password !== resetPasswordData.confirmPassword
    ) {
      showToast("Passwords and confirm password do not match", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(verifyForgotPasswordOtp(resetPasswordData))
        .then((res) => {
          if (res.payload?.message === "Invalid OTP") {
            dispatch(stopLoading());
            showToast("Invalid OTP", "error");
          } else if (res.payload?.message === "OTP expired") {
            dispatch(stopLoading());
            showToast("OTP expired", "error");
          } else if (res.payload?.success) {
            dispatch(stopLoading());
            setResetPasswordData({
              email: "",
              otp: "",
              password: "",
              confirmPassword: "",
            });
            setOtp(new Array(6).fill(""));
            showToast("Password updated successfully", "success");
            navigate("/login");
          } else {
            dispatch(stopLoading());
            showToast("Something went wrong, please try again later", "error");
          }
        })
        .catch((error) => {
          dispatch(stopLoading());
          showToast("Something went wrong, please try again later", "error");
        });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="Company Logo" className="auth-logo" />
        <h1>Reset Password</h1>
        <p>Set a new password using OTP sent to your email</p>
      </div>

      <div className="auth-right">
        <div className="auth-form" onSubmit={handleReset}>
          <h2>Reset Password</h2>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={resetPasswordData.email}
              onChange={handleChangeResetPasswordData}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group otp-group">
            <label>OTP</label>
            <div className="otp-inputs">
              {otp?.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-box"
                />
              ))}
            </div>
          </div>

          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={resetPasswordData.password}
                onChange={handleChangeResetPasswordData}
                placeholder="Enter new password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <div className="input-group password-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={resetPasswordData.confirmPassword}
                onChange={handleChangeResetPasswordData}
                placeholder="Confirm password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleReset}>
            Reset Password
          </button>

          <p className="switch-link">
            Back to <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
