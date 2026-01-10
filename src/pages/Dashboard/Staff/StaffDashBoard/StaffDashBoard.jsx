import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaArrowRight,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const StaffDashBoard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["staff-dashboard-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/staff/${user?.email}/stats`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch Today's Tasks
  const { data: todaysTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["staff-todays-tasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/issues/${user?.email}/assinedTask?today=true`
      );
      // Filter manually if API doesn't filtering perfectly, or just take the result
      // Assuming API returns all assigned tasks, we might filter client side if needed
      // But based on user request, we assume this endpoint works or we just show assigned.
      // Let's assume the endpoint returns *assigned* tasks.
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Prepare Chart Data
  const chartData = (stats.last7Days || []).map((day) => ({
    name: day.label,
    issues: day.count,
    date: day.date,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold mb-1">{payload[0].payload.date}</p>
          <p className="text-emerald-400">
            Resolved: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Staff Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{user?.displayName}</span>. Here's your daily briefing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Today
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <button 
             onClick={() => {
                queryClient.invalidateQueries(["staff-dashboard-stats"]);
                queryClient.invalidateQueries(["staff-todays-tasks"]);
             }}
             className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-brand-emerald hover:bg-emerald-50"
          >
             <FaSearch className="w-4 h-4" /> {/* Just using as a refresh/action placeholder for now */}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
           <>
              {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-32 animate-pulse flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="h-4 w-24 bg-slate-100 rounded"></div>
                       <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                    </div>
                    <div className="h-8 w-16 bg-slate-100 rounded"></div>
                 </div>
              ))}
           </>
        ) : (
           <>
            <StatCard
              title="Assigned to You"
              value={stats.assignedCount || 0}
              icon={<FaClipboardList className="text-brand-emerald" />}
              trend="+2 new"
              trendColor="text-emerald-600"
              bgColor="bg-white"
            />
            <StatCard
              title="Resolved (Total)"
              value={stats.resolvedCount || 0}
              icon={<FaCheckCircle className="text-blue-500" />}
              trend="Lifetime"
              trendColor="text-blue-600"
              bgColor="bg-white"
            />
            <StatCard
              title="Avg Response Time"
              value={`${stats.avgResponseHours || 0}h`}
              icon={<FaClock className="text-amber-500" />}
              trend="Last 30 days"
              trendColor="text-amber-600"
              bgColor="bg-white"
            />
            <StatCard
              title="Pending Action"
              value={stats.openCount || 0}
              icon={<FaExclamationCircle className="text-rose-500" />}
              trend="Needs attention"
              trendColor="text-rose-600"
              bgColor="bg-white"
            />
           </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section - Spans 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Activity Trends</h3>
              <p className="text-sm text-slate-500">Issues resolved over the last 7 days</p>
            </div>
            {!statsLoading && (
                <select className="select select-sm select-bordered rounded-full bg-slate-50 text-slate-600 font-medium">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
            )}
          </div>

          <div className="h-[300px] w-full">
            {statsLoading ? (
               <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">
                  <span className="text-slate-300 font-medium">Loading chart data...</span>
               </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 12 }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="issues"
                      stroke="#10B981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorIssues)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent/Today's Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Today's Tasks</h3>
            <span className="badge badge-lg bg-emerald-100 text-emerald-700 border-none font-bold">
              {todaysTasks.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] custom-scrollbar">
            {tasksLoading ? (
               <div className="flex flex-col gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>)}
               </div>
            ) : todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <div
                  key={task._id}
                  className="group p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-emerald/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all cursor-pointer"
                  onClick={() => navigate(`/issue-details/${task._id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {task.priority || "Normal"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-brand-emerald transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                     <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <FaClipboardList /> {task.status}
                     </span>
                     <button className="text-xs font-bold text-brand-emerald flex items-center gap-1 hover:gap-2 transition-all">
                        View <FaArrowRight />
                     </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-3">
                   <FaCheckCircle className="text-xl" />
                </div>
                <p className="text-slate-900 font-bold text-sm">All caught up!</p>
                <p className="text-slate-500 text-xs mt-1">No tasks assigned for today.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
             <Link to="/issues" className="btn btn-outline btn-sm w-full font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                View All Assignments
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean cards
const StatCard = ({ title, value, icon, trend, trendColor, bgColor }) => (
  <div className={`${bgColor} p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-xl border border-slate-100`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
       {trend && (
           <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-50 ${trendColor}`}>
             {trend}
           </span>
       )}
    </div>
  </div>
);

export default StaffDashBoard;
