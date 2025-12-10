import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  FiUsers,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

export default function StaffDashBoard() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stats = {} } = useQuery({
    queryKey: ["staff-dashboard-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/dashboard/staff/${user?.email}/stats`
      );
      return res.data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 2,
  });

  const { data: todaysTasks = [] } = useQuery({
    queryKey: ["staff-todays-tasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/issues/${user?.email}/assinedTask?today=true`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const refreshAll = () => {
    queryClient.invalidateQueries(["staff-dashboard-stats", user?.email]);
    queryClient.invalidateQueries(["staff-todays-tasks", user?.email]);
  };

  const assignedCount = stats.assignedCount ?? 0;
  const resolvedCount = stats.resolvedCount ?? 0;
  const avgResponse = stats.avgResponseHours ?? "-";
  const openCount = stats.openCount ?? 0;
  const assignedToYou = stats.assignedToYou ?? 0;

  const last7 = stats.last7Days ?? [];
  const maxVal = Math.max(1, ...last7.map((d) => d.count || 0));

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          <p className="text-sm text-muted">Staff summary & today's tasks</p>
        </div>

        <div className="flex gap-2 items-center">
          <button className="btn btn-ghost btn-sm" onClick={refreshAll}>
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
          <div className="text-sm text-muted">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned issues"
          value={assignedCount}
          icon={<FiUsers />}
        />
        <StatCard
          title="Issues resolved"
          value={resolvedCount}
          icon={<FiCheckCircle />}
        />
        <StatCard
          title="Today's tasks"
          value={todaysTasks.length}
          icon={<FiClipboard />}
        />
        <StatCard
          title="Avg response (hrs)"
          value={avgResponse}
          icon={<FiClock />}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-base-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Activity (last 7 days)</h3>
            <div className="text-sm text-muted">
              Total: {last7.reduce((s, d) => s + (d.count || 0), 0)}
            </div>
          </div>

          <div className="flex items-end gap-2 h-36">
            {last7.length === 0 && (
              <div className="text-sm text-muted">No data</div>
            )}
            {last7.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-sm bg-primary transition-all"
                  style={{ height: `${((d.count || 0) / maxVal) * 100}%` }}
                  title={`${d.date}: ${d.count || 0}`}
                />
                <div className="text-xs mt-2 text-muted">
                  {d.label || d.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Status distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Resolved</span>
              <span className="font-semibold">{resolvedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Assigned</span>
              <span className="font-semibold">{assignedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Open</span>
              <span className="font-semibold">{openCount}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-base-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Today's Tasks</h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() =>
                queryClient.invalidateQueries([
                  "staff-todays-tasks",
                  user?.email,
                ])
              }
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3">
            {todaysTasks.length === 0 && (
              <div className="text-sm text-muted">No tasks for today 🎉</div>
            )}

            {todaysTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between bg-base-100 p-3 rounded"
              >
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted">
                    {task.location} • {task.priority}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-xs"
                    onClick={() => navigate(`/issue-details/${task._id}`)}
                  >
                    View
                  </button>
                  <button className="btn btn-xs btn-primary">Start</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Open tickets</span>
              <span className="font-semibold">{openCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Assigned (you)</span>
              <span className="font-semibold">{assignedToYou}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Avg resolve time</span>
              <span className="font-semibold">
                {stats.avgResolveHours ?? "-"} hrs
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-base-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
      <div className="p-3 rounded-md bg-base-100 text-primary text-xl">
        {icon}
      </div>
      <div>
        <div className="text-sm text-muted">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
