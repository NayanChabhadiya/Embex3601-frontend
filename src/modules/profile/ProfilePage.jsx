import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getProfile } from "./store/profile.thunks.js";

import {
  selectProfile,
  selectProfileLoading,
  selectProfileError,
} from "./store/profile.selectors.js";

import Card from "../../components/common/card/Card.jsx";
import Badge from "../../components/common/badge/Badge.jsx";
import Loader from "../../components/common/loader/Loader.jsx";

import "./profile.scss";

// -----------------------------------------------------------------------------
// Profile Page
// -----------------------------------------------------------------------------

const ProfilePage = () => {
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  // ---------------------------------------------------------------------------
  // Load Profile
  // ---------------------------------------------------------------------------

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (loading && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-page__loading">
          <Loader />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-page__header">
          <div>
            <h1 className="profile-page__title">Profile</h1>
            <p className="profile-page__description">
              View your account, access and subscription information.
            </p>
          </div>
        </div>

        <Card>
          <div className="profile-page__error">
            <h3>Unable to load profile</h3>

            <p>
              {error?.message ||
                error ||
                "Something went wrong while fetching your profile."}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Profile Helpers
  // ---------------------------------------------------------------------------

  const fullName =
    profile?.displayName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "-";

  const initials =
    [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .map((name) => name.charAt(0).toUpperCase())
      .join("") || "U";

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="profile-page">
      {/* =================================================================== */}
      {/* Page Header */}
      {/* =================================================================== */}

      <div className="profile-page__header">
        <div>
          <h1 className="profile-page__title">Profile</h1>

          <p className="profile-page__description">
            View your account, access and subscription information.
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Profile Overview */}
      {/* =================================================================== */}

      <div className="profile-page__overview">
        <Card>
          <div className="profile-card">
            {/* ------------------------------------------------------------- */}
            {/* Avatar */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-card__avatar">{initials}</div>

            {/* ------------------------------------------------------------- */}
            {/* Basic Information */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-card__content">
              <div className="profile-card__identity">
                <h2>{fullName}</h2>

                <div className="profile-card__badges">
                  {profile?.status && <Badge>{profile.status}</Badge>}

                  {profile?.verificationStatus && (
                    <Badge>{profile.verificationStatus}</Badge>
                  )}
                </div>
              </div>

              <p className="profile-card__email">{profile?.email || "-"}</p>

              <p className="profile-card__type">{profile?.type || "-"}</p>
            </div>
          </div>
        </Card>

        {/* ----------------------------------------------------------------- */}
        {/* Subscription Summary */}
        {/* ----------------------------------------------------------------- */}

        <Card>
          <div className="subscription-summary">
            <div className="subscription-summary__header">
              <div>
                <span className="subscription-summary__label">
                  Subscription
                </span>

                <h2>Current Plan</h2>
              </div>

              <div className="subscription-summary__icon">$</div>
            </div>

            <div className="subscription-summary__content">
              <div className="subscription-summary__value">-</div>

              <p>
                Subscription information will appear here when the subscription
                API is connected.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* =================================================================== */}
      {/* User Information */}
      {/* =================================================================== */}

      <section className="profile-section">
        <div className="profile-section__header">
          <div>
            <h2 className="profile-section__title">User Information</h2>

            <p className="profile-section__description">
              Basic information associated with your account.
            </p>
          </div>
        </div>

        <Card>
          <div className="profile-info-grid">
            {/* ------------------------------------------------------------- */}
            {/* First Name */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">First Name</span>

              <span className="profile-info-item__value">
                {profile?.firstName || "-"}
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Last Name */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">Last Name</span>

              <span className="profile-info-item__value">
                {profile?.lastName || "-"}
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Email */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">Email</span>

              <span className="profile-info-item__value">
                {profile?.email || "-"}
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Mobile */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">Mobile</span>

              <span className="profile-info-item__value">
                {profile?.mobile || "-"}
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* User Type */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">User Type</span>

              <span className="profile-info-item__value">
                {profile?.type || "-"}
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Account Status */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">Account Status</span>

              <span className="profile-info-item__value">
                {profile?.status ? <Badge>{profile.status}</Badge> : "-"}
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Verification */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">Verification</span>

              <span className="profile-info-item__value">
                {profile?.verificationStatus ? (
                  <Badge>{profile.verificationStatus}</Badge>
                ) : (
                  "-"
                )}
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Created At */}
            {/* ------------------------------------------------------------- */}

            <div className="profile-info-item">
              <span className="profile-info-item__label">Member Since</span>

              <span className="profile-info-item__value">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* =================================================================== */}
      {/* Access */}
      {/* =================================================================== */}

      <section className="profile-section">
        <div className="profile-section__header">
          <div>
            <h2 className="profile-section__title">Access</h2>

            <p className="profile-section__description">
              Your roles, permissions and available system access.
            </p>
          </div>
        </div>

        <Card>
          <div className="profile-empty-state">
            <div className="profile-empty-state__icon">🔐</div>

            <h3>Access information</h3>

            <p>
              Roles and permission details will appear here when the
              authorization data is connected to the profile API.
            </p>
          </div>
        </Card>
      </section>

      {/* =================================================================== */}
      {/* Subscription & Usage */}
      {/* =================================================================== */}

      <section className="profile-section">
        <div className="profile-section__header">
          <div>
            <h2 className="profile-section__title">Subscription & Usage</h2>

            <p className="profile-section__description">
              Track your subscription period, resource limits and usage.
            </p>
          </div>
        </div>

        <div className="usage-grid">
          {/* --------------------------------------------------------------- */}
          {/* Plan */}
          {/* --------------------------------------------------------------- */}

          <Card>
            <div className="usage-card">
              <span className="usage-card__label">Current Plan</span>

              <strong className="usage-card__value">-</strong>

              <span className="usage-card__description">Plan information</span>
            </div>
          </Card>

          {/* --------------------------------------------------------------- */}
          {/* Days Remaining */}
          {/* --------------------------------------------------------------- */}

          <Card>
            <div className="usage-card">
              <span className="usage-card__label">Days Remaining</span>

              <strong className="usage-card__value">-</strong>

              <span className="usage-card__description">
                Subscription period
              </span>
            </div>
          </Card>

          {/* --------------------------------------------------------------- */}
          {/* Companies */}
          {/* --------------------------------------------------------------- */}

          <Card>
            <div className="usage-card">
              <span className="usage-card__label">Companies</span>

              <strong className="usage-card__value">-</strong>

              <span className="usage-card__description">Used / Allowed</span>
            </div>
          </Card>

          {/* --------------------------------------------------------------- */}
          {/* Users */}
          {/* --------------------------------------------------------------- */}

          <Card>
            <div className="usage-card">
              <span className="usage-card__label">Users</span>

              <strong className="usage-card__value">-</strong>

              <span className="usage-card__description">Used / Allowed</span>
            </div>
          </Card>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Usage Details */}
        {/* ----------------------------------------------------------------- */}

        <Card>
          <div className="usage-details">
            <div className="usage-details__header">
              <div>
                <h3>Resource Usage</h3>

                <p>Your subscription resource usage will be displayed here.</p>
              </div>
            </div>

            <div className="usage-details__empty">
              Subscription usage data is not available yet.
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default ProfilePage;
