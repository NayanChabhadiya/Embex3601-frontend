import "./platform-admin-dashboard.scss";

import { useSelector } from "react-redux";

import { Card, SummaryCard } from "../../../../components/common/card";
import { Badge } from "../../../../components/common/badge";
import PageHeader from "../../../../components/layout/page/components/PageHeader";

import {
  selectIsPlatformAdminLoading,
  selectPlatformAdminAccess,
} from "../../store/platform-admin.selectors.js";

function PlatformAdminDashboard() {
  const access = useSelector(selectPlatformAdminAccess);
  const isLoading = useSelector(selectIsPlatformAdminLoading);

  if (isLoading) {
    return (
      <section className="platform-admin-dashboard">
        <PageHeader
          title="Platform Administration"
          description="Manage and monitor Embex360 platform administration."
        />

        <Card className="platform-admin-dashboard__state">
          <p>Loading platform administrator access...</p>
        </Card>
      </section>
    );
  }

  if (!access) {
    return (
      <section className="platform-admin-dashboard">
        <PageHeader
          title="Platform Administration"
          description="Manage and monitor Embex360 platform administration."
        />

        <Card className="platform-admin-dashboard__state">
          <h2>Access Unavailable</h2>
          <p>
            Platform administrator access could not be resolved for the current
            account.
          </p>
        </Card>
      </section>
    );
  }

  const role = access.role?.replace(/_/g, " ").toUpperCase() || "UNKNOWN";

  const status = access.status?.toUpperCase() || "UNKNOWN";

  const verificationStatus =
    access.verificationStatus?.toUpperCase() || "UNKNOWN";

  const accessStatus = access.accessStatus?.toUpperCase() || "UNKNOWN";

  return (
    <section className="platform-admin-dashboard">
      <PageHeader
        title="Platform Administration"
        description="Manage and monitor Embex360 platform administration."
      />

      {/* Access Summary */}
      <div className="platform-admin-dashboard__summary">
        <SummaryCard
          title="Administrator Role"
          value={role}
          description="Current platform authority"
        />

        <SummaryCard
          title="Account Status"
          value={status}
          description="Platform administrator status"
        />

        <SummaryCard
          title="Verification"
          value={verificationStatus}
          description="Administrator verification"
        />

        <SummaryCard
          title="Platform Access"
          value={accessStatus}
          description="Current access state"
        />
      </div>

      {/* Administration Overview */}
      <div className="platform-admin-dashboard__content">
        <Card className="platform-admin-dashboard__panel">
          <div className="platform-admin-dashboard__panel-header">
            <div>
              <h2>Administration Overview</h2>
              <p>
                Current authority and security state of the platform
                administrator account.
              </p>
            </div>

            <Badge variant="success">{accessStatus}</Badge>
          </div>

          <div className="platform-admin-dashboard__status-list">
            <div className="platform-admin-dashboard__status-item">
              <div>
                <span>Administrator Role</span>
                <strong>{role}</strong>
              </div>

              <Badge variant="primary">{role}</Badge>
            </div>

            <div className="platform-admin-dashboard__status-item">
              <div>
                <span>Account Status</span>
                <strong>{status}</strong>
              </div>

              <Badge variant="success">{status}</Badge>
            </div>

            <div className="platform-admin-dashboard__status-item">
              <div>
                <span>Verification Status</span>
                <strong>{verificationStatus}</strong>
              </div>

              <Badge variant="success">{verificationStatus}</Badge>
            </div>

            <div className="platform-admin-dashboard__status-item">
              <div>
                <span>Access Status</span>
                <strong>{accessStatus}</strong>
              </div>

              <Badge variant="success">{accessStatus}</Badge>
            </div>
          </div>
        </Card>

        {/* Administrator Identity */}
        <Card className="platform-admin-dashboard__panel">
          <div className="platform-admin-dashboard__panel-header">
            <div>
              <h2>Administrator Identity</h2>
              <p>Trusted platform administrator identity context.</p>
            </div>
          </div>

          <div className="platform-admin-dashboard__identity">
            <div className="platform-admin-dashboard__identity-item">
              <span>Platform Admin ID</span>
              <strong>{access.id}</strong>
            </div>

            <div className="platform-admin-dashboard__identity-item">
              <span>User ID</span>
              <strong>{access.userId}</strong>
            </div>

            <div className="platform-admin-dashboard__identity-item">
              <span>Assigned Role</span>
              <strong>{role}</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Platform Administration Scope */}
      <Card className="platform-admin-dashboard__scope">
        <div className="platform-admin-dashboard__scope-header">
          <div>
            <h2>Platform Administration</h2>
            <p>
              Platform-level controls are available to authorized administrators
              only.
            </p>
          </div>
        </div>

        <div className="platform-admin-dashboard__scope-grid">
          <div className="platform-admin-dashboard__scope-item">
            <span className="platform-admin-dashboard__scope-indicator" />

            <div>
              <strong>Subscription Management</strong>
              <p>Manage platform subscription plans and their lifecycle.</p>
            </div>
          </div>

          <div className="platform-admin-dashboard__scope-item">
            <span className="platform-admin-dashboard__scope-indicator" />

            <div>
              <strong>Platform Configuration</strong>
              <p>Platform-level administration controls and configuration.</p>
            </div>
          </div>

          <div className="platform-admin-dashboard__scope-item">
            <span className="platform-admin-dashboard__scope-indicator" />

            <div>
              <strong>Feature Management</strong>
              <p>Manage platform features used by subscription plans.</p>
            </div>
          </div>

          <div className="platform-admin-dashboard__scope-item">
            <span className="platform-admin-dashboard__scope-indicator" />

            <div>
              <strong>Platform Monitoring</strong>
              <p>Monitor platform administration and system-level activity.</p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default PlatformAdminDashboard;
