// src/pages/dashboard/AdminDashboard.jsx
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiSlash,
  FiDollarSign,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

export default function AdminDashBoard() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/admin/stats");
      return res.data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  const { data: latestIssues = [] } = useQuery({
    queryKey: ["admin-latest-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues?limit=6&sort=createdAt_desc");
      return res.data;
    },
    enabled: !!user,
  });

  const { data: latestPayments = [] } = useQuery({
    queryKey: ["admin-latest-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/payments?limit=6&sort=createdAt_desc"
      );
      return res.data;
    },
    enabled: !!user,
  });

  const { data: latestUsers = [] } = useQuery({
    queryKey: ["admin-latest-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?limit=6&sort=createdAt_desc");
      return res.data;
    },
    enabled: !!user,
  });

  const refreshAll = () => {
    qc.invalidateQueries(["admin-dashboard-stats"]);
    qc.invalidateQueries(["admin-latest-issues"]);
    qc.invalidateQueries(["admin-latest-payments"]);
    qc.invalidateQueries(["admin-latest-users"]);
  };

  // map API fields to local variable names
  const totalSubmitted = stats.totalIssues ?? 0;
  const resolvedCount = stats.totalResolvedIssues ?? 0;
  const pendingCount = stats.totalPendingIssues ?? 0;
  const rejectedCount = stats.totalRejectedIssues ?? 0;

  const paymentsCount = stats.paymentsCount ?? 0;
  const paymentsTotalAmount = stats.paymentsTotalAmount ?? 0;
  const last7Days = stats.last7Days ?? []; // if you later add last7Days on server

  const maxVal = Math.max(1, ...last7Days.map((d) => d.count || 0));

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted">
            Site overview — issues, payments, users
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={refreshAll}>
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total issues"
          value={totalSubmitted}
          icon={<FiFileText />}
          className="lg:col-span-2"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          icon={<FiCheckCircle />}
        />
        <StatCard title="Pending" value={pendingCount} icon={<FiClock />} />
        <StatCard title="Rejected" value={rejectedCount} icon={<FiSlash />} />
        <StatCard
          title="Total payments"
          value={paymentsCount}
          icon={<FiDollarSign />}
          className="lg:col-span-2"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-base-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">
              Issues created (last 7 days)
            </h3>
            <div className="text-sm text-muted">
              Total: {last7Days.reduce((s, d) => s + (d.count || 0), 0)}
            </div>
          </div>

          <div className="flex items-end gap-2 h-40">
            {last7Days.length === 0 && (
              <div className="text-sm text-muted">No data</div>
            )}
            {last7Days.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary rounded-sm"
                  style={{ height: `${((d.count || 0) / maxVal) * 100}%` }}
                  title={`${d.date}: ${d.count || 0}`}
                />
                <div className="text-xs mt-2 text-muted">
                  {d.date?.slice(5) ?? ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3">Payments / Revenue</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Payments count</span>
              <span className="font-semibold">{paymentsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total received</span>
              <span className="font-semibold">{paymentsTotalAmount}</span>
            </div>
            <div className="mt-4">
              <button
                className="btn btn-sm btn-outline w-full"
                onClick={() => navigate("/dashboard/payments")}
              >
                View payments
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-base-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Latest issues</h3>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => navigate("/dashboard/issues")}
            >
              View all
            </button>
          </div>

          {latestIssues.length === 0 ? (
            <div className="text-sm text-muted">No recent issues</div>
          ) : (
            <div className="space-y-3">
              {latestIssues.map((it) => (
                <div
                  key={it._id}
                  className="bg-base-100 rounded p-3 flex items-start justify-between"
                >
                  <div className="w-2/3">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-muted">
                      {it.status} • {it.priority} •{" "}
                      {new Date(it.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      className="btn btn-xs"
                      onClick={() => navigate(`/issue-details/${it._id}`)}
                    >
                      View
                    </button>
                    <div className="text-sm font-semibold">
                      {it.upvotes ?? 0} ↑
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-base-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Latest payments</h3>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => navigate("/dashboard/payments")}
            >
              View all
            </button>
          </div>

          {latestPayments.length === 0 ? (
            <div className="text-sm text-muted">No recent payments</div>
          ) : (
            <div className="space-y-3">
              {latestPayments.map((p) => (
                <div
                  key={p._id}
                  className="bg-base-100 rounded p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">
                      #{p._id?.toString?.().slice(-6)}
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{p.amount}</div>
                    <div className="text-xs text-muted">{p.method ?? "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-base-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Latest users</h3>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => navigate("/dashboard/users")}
            >
              View all
            </button>
          </div>

          {latestUsers.length === 0 ? (
            <div className="text-sm text-muted">No recent users</div>
          ) : (
            <div className="space-y-3">
              {latestUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between bg-base-100 rounded p-2"
                >
                  <div>
                    <div className="font-medium">
                      {u.name ?? u.displayName ?? u.email}
                    </div>
                    <div className="text-xs text-muted">{u.email}</div>
                  </div>
                  <div className="text-sm text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, className = "" }) {
  return (
    <div
      className={`bg-base-200 rounded-lg p-4 shadow-sm flex items-center gap-4 ${className}`}
    >
      <div className="p-3 rounded bg-base-100 text-primary text-xl">{icon}</div>
      <div>
        <div className="text-sm text-muted">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
