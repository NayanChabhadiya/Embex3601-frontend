import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "../../store/apiSlice/componentSlice";
import {
  resendVerifyRegisterOtp,
  verifyRegisterOtp,
} from "../../store/apiSlice/authSlice";
import { useToast } from "../../contexts/toastContext/toastContext";
import logo from "../../assets/logo/Logo_1.png";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const { showToast } = useToast();
  const [verificationEmailData, setVerificationEmailData] = useState({
    email: "",
    otp: "",
  });

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChangeVerificationEmailData = (e, index) => {
    setVerificationEmailData({
      ...verificationEmailData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setVerificationEmailData({
        ...verificationEmailData,
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
      setVerificationEmailData({
        ...verificationEmailData,
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

  const handleResetOtp = () => {
    if (!verificationEmailData.email) {
      showToast("Please enter your email.", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(resendVerifyRegisterOtp(verificationEmailData)).then((res) => {
        if (res?.payload?.message === "User not found") {
          dispatch(stopLoading());
          showToast("This email is not registered.", "error");
        } else if (res?.payload?.message === "User already verified") {
          dispatch(stopLoading());
          showToast("Email is already verified.", "info");
          navigate("/login");
        } else if (res?.payload?.success) {
          setVerificationEmailData({
            email: "",
            otp: new Array(6).fill(""),
          });
          dispatch(stopLoading());
          showToast("OTP sent successfully.", "success");
        } else {
          dispatch(stopLoading());
          showToast("Something went wrong, please try again later.", "error");
        }
      });
    }
  };

  const handleVerifyEmail = (e) => {
    if (!verificationEmailData.email) {
      showToast("Please enter your email.", "error");
      return;
    } else if (!verificationEmailData.otp || getOtpValue()?.length < 6) {
      showToast("OTP is required and must be 6 digits", "error");
      return;
    } else if (verificationEmailData.otp?.length < 6) {
      showToast("Please enter a valid 6-digit OTP", "error");
      return;
    } else if (!/^\d{6}$/.test(verificationEmailData.otp)) {
      showToast("OTP must contain only digits", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(verifyRegisterOtp(verificationEmailData)).then((res) => {
        if (res?.payload?.message === "Invalid OTP.") {
          dispatch(stopLoading());
          showToast("Invalid OTP, please try again.", "error");
        } else if (res?.payload?.message === "User already verified") {
          dispatch(stopLoading());
          showToast("Email is already verified.", "info");
          navigate("/login");
        } else if (res?.payload?.success) {
          setVerificationEmailData({
            email: "",
            otp: new Array(6).fill(""),
          });
          dispatch(stopLoading());
          showToast("Email verified successfully.", "success");
          navigate("/login");
        } else {
          dispatch(stopLoading());
          showToast("Something went wrong, please try again later.", "error");
        }
      });
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="Company Logo" className="auth-logo" />
        <h1>Verify Your Email</h1>
        <p>We'll send you a verification code.</p>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>Email Verification</h2>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={verificationEmailData.email}
              onChange={handleChangeVerificationEmailData}
              placeholder="Enter your email"
            />
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              handleResetOtp();
            }}
          >
            Send Verification Code
          </button>

          <div className="input-group otp-group">
            <label>Verification Code</label>
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
          <button
            className="btn-primary"
            onClick={() => {
              handleVerifyEmail();
            }}
          >
            Verify Email
          </button>

          <p className="switch-link" style={{ marginTop: "1rem" }}>
            Already verified? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
