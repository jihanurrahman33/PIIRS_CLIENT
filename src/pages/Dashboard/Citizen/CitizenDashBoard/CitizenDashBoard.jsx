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
  FaPlus,
  FaSyncAlt, // Refresh icon replacement
  FaExclamationTriangle,
  FaCheckCircle,
  FaThumbsUp,
  FaClock,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const CitizenDashBoard = () => {
  const { user, userDoc } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["citizen-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/citizen/${user?.email}/stats`);
      return res.data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 2,
  });

  // Fetch Recent Issues using the /issues/user/:email API obtained from the user
  const limit = 6;
  const { data: recentIssues = [], isLoading: recentLoading } = useQuery({
    queryKey: ["citizen-recent-issues", user?.email, limit],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/user/${user?.email}?limit=${limit}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const refresh = () => {
    queryClient.invalidateQueries(["citizen-stats", user?.email]);
    queryClient.invalidateQueries(["citizen-recent-issues", user?.email, limit]);
  };

  const isBlocked = Boolean(userDoc?.isBlocked);

  // Chart Data
  const chartData = (stats.last7Days || []).map((day) => ({
    name: day.label,
    reports: day.count,
    date: day.date,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold mb-1">{payload[0].payload.date}</p>
          <p className="text-brand-emerald">
            Reports: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "rejected": return "text-red-600 bg-red-50 border-red-100";
      case "in-progress": return "text-blue-600 bg-blue-50 border-blue-100";
      default: return "text-amber-600 bg-amber-50 border-amber-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Impact
          </h1>
          <p className="text-slate-500 mt-1">
            Track your reports and community contributions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={refresh}
             className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-brand-emerald hover:bg-emerald-50"
             title="Refresh Data"
          >
             <FaSyncAlt className={`w-4 h-4 ${statsLoading || recentLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button 
             onClick={() => navigate("/report-issue")}
             disabled={isBlocked}
             className="btn btn-primary btn-sm gap-2 shadow-lg shadow-brand-emerald/20 border-none bg-brand-emerald hover:bg-emerald-600 text-white"
          >
             <FaPlus /> Report Issue
          </button>
        </div>
      </div>

      {isBlocked && (
        <div className="alert alert-error shadow-sm rounded-xl border border-red-200 bg-red-50">
          <FaExclamationTriangle className="text-red-500" />
          <div className="text-red-700">
            <h3 className="font-bold">Account Restricted</h3>
            <div className="text-xs mt-1 opacity-90">
              Your account has been flagged. You cannot submit or edit issues at this time.
            </div>
          </div>
        </div>
      )}

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
              title="Total Reports"
              value={stats.submittedCount || 0}
              icon={<FaExclamationTriangle className="text-brand-emerald" />}
              bgColor="bg-white"
            />
            <StatCard
              title="Resolved"
              value={stats.resolvedCount || 0}
              icon={<FaCheckCircle className="text-blue-500" />}
              bgColor="bg-white"
            />
            <StatCard
              title="Pending"
              value={stats.pendingCount || 0}
              icon={<FaClock className="text-amber-500" />}
              bgColor="bg-white"
            />
            <StatCard
              title="Upvotes Given"
              value={stats.upvotesGiven || 0}
              icon={<FaThumbsUp className="text-purple-500" />}
              bgColor="bg-white"
            />
           </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Reporting Activity</h3>
              <p className="text-sm text-slate-500">Your submissions over the last 7 days</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {statsLoading ? (
               <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">
                  <span className="text-slate-300 font-medium">Loading activity...</span>
               </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
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
                        toc
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="reports"
                      stroke="#10B981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorReports)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Reports List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Reports</h3>
            {userDoc && !isBlocked && (
                <Link to="/dashboard/add-issue" className="text-xs font-bold text-brand-emerald hover:underline">
                    New Report
                </Link>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] custom-scrollbar">
            {recentLoading ? (
               <div className="flex flex-col gap-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>)}
               </div>
            ) : recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="group p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-emerald/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md border ${getStatusColor(issue.status)}`}
                    >
                      {issue.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-brand-emerald transition-colors">
                    {issue.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                     <FaMapMarkerAlt className="text-slate-300" />
                     <span className="truncate max-w-[150px]">{issue.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60">
                     <button 
                        onClick={() => navigate(`/issue-details/${issue._id}`)}
                        className="flex-1 btn btn-xs btn-ghost text-slate-500 hover:text-brand-emerald hover:bg-emerald-50"
                     >
                        View Details
                     </button>
                     {!isBlocked && issue.status !== 'resolved' && (
                        <button 
                            onClick={() => navigate(`/dashboard/update-issue/${issue._id}`)} // Assuming edit route
                            className="flex-1 btn btn-xs btn-ghost text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                            Edit
                        </button>
                     )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-3">
                   <FaExclamationTriangle className="text-xl" />
                </div>
                <p className="text-slate-900 font-bold text-sm">No reports yet</p>
                <p className="text-slate-500 text-xs mt-1">Found an issue in your city? Report it now!</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
             <Link to="/dashboard/my-reports" className="btn btn-outline btn-sm w-full font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                View All My Reports
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean cards
const StatCard = ({ title, value, icon, bgColor }) => (
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
  </div>
);

export default CitizenDashBoard;
