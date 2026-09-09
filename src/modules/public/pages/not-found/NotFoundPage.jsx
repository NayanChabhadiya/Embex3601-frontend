import { useNavigate } from "react-router-dom";

import { APP_ROUTES } from "../../../../constant";
import { Button } from "../../../../components/common";

import "./not-found-page.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(APP_ROUTES.FALLBACK, { replace: true });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(APP_ROUTES.FALLBACK, { replace: true });
  };

  return (
    <main className="not-found-page">
      <section
        className="not-found-page__card"
        aria-labelledby="not-found-title"
      >
        <div className="not-found-page__code" aria-hidden="true">
          404
        </div>

        <div className="not-found-page__content">
          <span className="not-found-page__eyebrow">Page not found</span>

          <h1 id="not-found-title">We couldn&apos;t find that page.</h1>

          <p>
            The page you are looking for may have been moved, removed, or the
            address may be incorrect.
          </p>

          <div className="not-found-page__actions">
            <Button variant="primary" size="medium" onClick={handleGoHome}>
              Go to homepage
            </Button>

            <Button variant="outline" size="medium" onClick={handleGoBack}>
              Go back
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
