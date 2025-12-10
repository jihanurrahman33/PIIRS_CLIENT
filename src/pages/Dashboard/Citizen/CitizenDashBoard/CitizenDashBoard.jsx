// src/pages/dashboard/CitizenDashboard.jsx
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiThumbsUp,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

export default function CitizenDashBoard() {
  const { user, userDoc } = useAuth(); // userDoc should contain isBlocked flag if available
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: stats = {} } = useQuery({
    queryKey: ["citizen-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/citizen/${user?.email}/stats`
      );
      return res.data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 2,
  });

  const { data: recentIssues = [], isLoading: recentLoading } = useQuery({
    queryKey: ["citizen-recent-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/user/${user?.email}?limit=6`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const refresh = () => {
    qc.invalidateQueries(["citizen-stats", user?.email]);
    qc.invalidateQueries(["citizen-recent-issues", user?.email]);
  };

  const isBlocked = Boolean(
    userDoc && (userDoc.isBlocked || userDoc.isBlcoked)
  );

  const submittedCount = stats.submittedCount ?? 0;
  const resolvedCount = stats.resolvedCount ?? 0;
  const upvotesGiven = stats.upvotesGiven ?? 0;
  const last7 = stats.last7Days ?? [];
  const maxVal = Math.max(1, ...last7.map((d) => d.count || 0));

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Citizen Dashboard</h1>
          <p className="text-sm text-muted">
            Your reported issues, activity and impact
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={refresh}>
            <FiRefreshCw className="mr-2" /> Refresh
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/submit-issue")}
            disabled={isBlocked}
          >
            <FiPlus className="mr-2" /> Report Issue
          </button>
        </div>
      </header>

      {isBlocked && (
        <div className="alert alert-warning shadow-lg">
          <div>
            <FiAlertCircle className="inline mr-2" />
            <span className="font-medium">Account blocked</span>
            <div className="text-sm">
              You cannot submit, edit, upvote or boost issues. Contact admin.
            </div>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Issues Submitted"
          value={submittedCount}
          icon={<FiAlertCircle />}
        />
        <StatCard
          title="Issues Resolved"
          value={resolvedCount}
          icon={<FiCheckCircle />}
        />
        <StatCard
          title="Upvotes Given"
          value={upvotesGiven}
          icon={<FiThumbsUp />}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-base-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Your Activity (last 7 days)</h3>
            <div className="text-sm text-muted">
              Total: {last7.reduce((s, d) => s + (d.count || 0), 0)}
            </div>
          </div>

          <div className="flex items-end gap-2 h-36">
            {last7.length === 0 && (
              <div className="text-sm text-muted">No activity yet</div>
            )}
            {last7.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary rounded-sm transition-all"
                  style={{ height: `${((d.count || 0) / maxVal) * 100}%` }}
                  title={`${d.date}: ${d.count || 0}`}
                />
                <div className="text-xs mt-2 text-muted">
                  {d.label || d.date.slice(5)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3">Quick Info</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Open tickets</span>
              <span className="font-semibold">{stats.openCount ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Pending</span>
              <span className="font-semibold">{stats.pendingCount ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Resolved</span>
              <span className="font-semibold">{resolvedCount}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recently Submitted Issues</h3>
          <div className="text-sm text-muted">{recentIssues.length} shown</div>
        </div>

        {recentLoading ? (
          <div>Loading...</div>
        ) : recentIssues.length === 0 ? (
          <div className="text-sm text-muted">
            You haven't reported any issues yet.
          </div>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="bg-base-100 rounded p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-muted capitalize">
                    {issue.status} • {issue.priority}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-xs"
                    onClick={() => navigate(`/issue-details/${issue._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => navigate(`/edit-issue/${issue._id}`)}
                    disabled={isBlocked || issue.status === "resolved"}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-base-200 rounded-lg p-4 shadow-sm flex gap-4 items-center">
      <div className="p-3 rounded bg-base-100 text-primary text-xl">{icon}</div>
      <div>
        <div className="text-sm text-muted">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
