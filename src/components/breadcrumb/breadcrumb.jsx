import "./breadcrumb.scss";
const Breadcrumb = ({ items }) => {
  return (
    <nav className="breadcrumb-nav">
      {items?.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item}
          {index < items?.length - 1 && (
            <span className="separator">{`>`}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
