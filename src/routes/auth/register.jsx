import { useState } from "react";
import "./auth.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "../../contexts/toastContext/toastContext";
import { registerUser } from "../../store/apiSlice/userSlice";
import { startLoading, stopLoading } from "../../store/apiSlice/componentSlice";
import logo from "../../assets/logo/Logo_1.png";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChangeRegisterData = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = () => {
    if (!registerData.firstName) {
      showToast("Please enter your first name.", "error");
      return;
    } else if (!registerData.lastName) {
      showToast("Please enter your last name.", "error");
      return;
    } else if (!registerData.email) {
      showToast("Please enter your email.", "error");
      return;
    } else if (!registerData.password) {
      showToast("Please enter your password.", "error");
      return;
    } else if (registerData.password !== registerData.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(registerUser(registerData)).then((res) => {
        if (res?.payload?.message === "User already exists.") {
          dispatch(stopLoading());
          showToast("User already exists with same email.", "error");
        } else if (res?.payload?.success) {
          setRegisterData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          dispatch(stopLoading());
          showToast(
            "Registration successful! verification sent to your mail please verify. ",
            "success"
          );
          navigate("/verification");
        } else {
          dispatch(stopLoading());
          showToast("Something went wrong, please try again.", "error");
        }
      });
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="Company Logo" className="auth-logo" />
        <h1>Join Us!</h1>
        <p>Create your account to get started</p>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <h2>Register</h2>
          <div className="row">
            <div className="col">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={registerData.firstName}
                  onChange={handleChangeRegisterData}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div className="col">
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={registerData.lastName}
                  onChange={handleChangeRegisterData}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChangeRegisterData}
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={registerData.password}
                onChange={handleChangeRegisterData}
                placeholder="Enter password"
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
                value={registerData.confirmPassword}
                onChange={handleChangeRegisterData}
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
          <button className="btn-primary" onClick={handleRegister}>
            Register
          </button>
          <p className="switch-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
