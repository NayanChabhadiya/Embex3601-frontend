import "./loader.scss";
import img from "../../assets/logo/Logo_3.png";

const Loader = () => {
  return (
    // <div className="custom-loader-wrapper">
    //   <div className="loader-logo">E</div>
    //   <div className="custom-loader">
    //     <div className="dot dot1" />
    //     <div className="dot dot2" />
    //     <div className="dot dot3" />
    //   </div>
    //   <p className="loader-text">Ellite Overseas is Loading...</p>
    // </div>
    <div className="embex-loader-wrapper">
      <img src={img} alt="Loading EMBEX..." className="embex-loader-image" />
    </div>
  );
};

export default Loader;
