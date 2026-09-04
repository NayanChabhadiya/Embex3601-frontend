import { FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../../../store/apiSlice/componentSlice";
import CircularCountdown from "../../sessionTimer/circularCountdown";
import SessionTimer from "../../sessionTimer/sessionTimer";
import { useEffect, useState } from "react";
import logo from "../../../assets/logo/Logo_3.png";

const Header = () => {
  const isSidebarOpen = useSelector((state) => state.components.isSidebarOpen);
  const dispatch = useDispatch();

  const [secondsLeft, setSecondsLeft] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const updateCounter = () => {
      const timeLeftToExpireToken = token
        ? JSON.parse(atob(token.split(".")[1])).exp * 1000 - Date.now()
        : 0;
      setSecondsLeft(Math.floor(timeLeftToExpireToken / 1000));
    };

    updateCounter(); // Initial call to set the initial state
    const intervalId = setInterval(updateCounter, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  return (
    <header className={`header ${isSidebarOpen ? "expanded" : ""}`}>
      {!isSidebarOpen && (
        <div className="sidebar-toggle">
          <FaBars
            onClick={() => {
              dispatch(setSidebar(!isSidebarOpen));
            }}
          />
        </div>
      )}
      <div className="logo">
        {/* <h1>Embex International Private Limited</h1> */}
        <img className="logo-image" src={logo} alt="Embex Logo" />
      </div>
      {/* <SessionTimer duration={secondsLeft} /> */}
      <CircularCountdown sessionDurationInSeconds={secondsLeft} />
      <div className="profile">Profile</div>
    </header>
  );
};

export default Header;
