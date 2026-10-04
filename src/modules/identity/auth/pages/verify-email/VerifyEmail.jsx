import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useAuthentication from "../../hooks/useAuthentication.js";
import AUTH_MESSAGES from "../../constants/authentication.messages.js";

import "./verify-email.scss";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { verifyEmail } = useAuthentication();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(AUTH_MESSAGES.EMAIL_VERIFICATION_FAILED);
      return;
    }

    const verify = async () => {
      const result = await verifyEmail({ token });

      if (result.success) {
        setStatus("success");
        setMessage(
          result.data?.message || AUTH_MESSAGES.EMAIL_VERIFICATION_SUCCESS,
        );

        return;
      }

      setStatus("error");
      setMessage(result.error || AUTH_MESSAGES.EMAIL_VERIFICATION_FAILED);
    };

    verify();
  }, [searchParams, verifyEmail]);

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleGoToLogin = () => {
    navigate("/login", { replace: true });
  };

  const handleGoToRegister = () => {
    navigate("/register", { replace: true });
  };

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (status === "loading") {
    return (
      <div className="verify-email">
        <div className="verify-email__card">
          <div className="verify-email__brand">
            <span className="verify-email__eyebrow">EMAIL VERIFICATION</span>

            <h1 className="verify-email__brand-title">
              Secure your EMBEX360 account.
            </h1>

            <p className="verify-email__brand-description">
              We are securely verifying your email address. Please wait a
              moment.
            </p>
          </div>

          <div className="verify-email__content">
            <div className="verify-email__icon verify-email__icon--loading">
              <span />
            </div>

            <h2 className="verify-email__title">Verifying your email...</h2>

            <p className="verify-email__message">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------------------

  if (status === "success") {
    return (
      <div className="verify-email">
        <div className="verify-email__card">
          <div className="verify-email__brand">
            <span className="verify-email__eyebrow">EMAIL VERIFICATION</span>

            <h1 className="verify-email__brand-title">
              Your account is secure and ready.
            </h1>

            <p className="verify-email__brand-description">
              Your email address has been successfully verified. You can now
              securely sign in to EMBEX360.
            </p>
          </div>

          <div className="verify-email__content">
            <div className="verify-email__icon verify-email__icon--success">
              ✓
            </div>

            <h2 className="verify-email__title">Email verified successfully</h2>

            <p className="verify-email__message">{message}</p>

            <button
              type="button"
              className="verify-email__button"
              onClick={handleGoToLogin}
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  return (
    <div className="verify-email">
      <div className="verify-email__card">
        <div className="verify-email__brand">
          <span className="verify-email__eyebrow">EMAIL VERIFICATION</span>

          <h1 className="verify-email__brand-title">
            Let's get your account verified.
          </h1>

          <p className="verify-email__brand-description">
            Verification links are secure and time-limited. If your link has
            expired, you can register again or request a new verification email.
          </p>
        </div>

        <div className="verify-email__content">
          <div className="verify-email__icon verify-email__icon--error">!</div>

          <h2 className="verify-email__title">Verification failed</h2>

          <p className="verify-email__message">
            {message || "This verification link is invalid or expired."}
          </p>

          <div className="verify-email__actions">
            <button
              type="button"
              className="verify-email__button"
              onClick={handleGoToLogin}
            >
              Go to Sign In
            </button>

            <button
              type="button"
              className="verify-email__secondary-button"
              onClick={handleGoToRegister}
            >
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
