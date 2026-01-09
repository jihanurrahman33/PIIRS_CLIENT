// src/pages/dashboard/AdminDashboard.jsx
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiSlash,
  FiUsers,
  FiRefreshCw,
  FiTrendingUp,
  FiCreditCard,
  FiArrowUpRight
} from "react-icons/fi";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

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
  });

  const { data: latestIssues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ["admin-latest-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues?limit=5&sort=createdAt_desc");
      return res.data;
    },
    enabled: !!user,
  });

  const { data: latestUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-latest-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?limit=5&sort=createdAt_desc");
      return res.data;
    },
    enabled: !!user,
  });

  const refreshAll = () => {
    qc.invalidateQueries(["admin-dashboard-stats"]);
    qc.invalidateQueries(["admin-latest-issues"]);
    qc.invalidateQueries(["admin-latest-users"]);
  };

  const isLoading = statsLoading || issuesLoading || usersLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // map API fields to local variable names
  const totalSubmitted = stats.totalIssues ?? 0;
  const resolvedCount = stats.totalResolvedIssues ?? 0;
  const pendingCount = stats.totalPendingIssues ?? 0;
  const rejectedCount = stats.totalRejectedIssues ?? 0;

  const paymentsCount = stats.paymentsCount ?? 0;
  const paymentsTotalAmount = stats.paymentsTotalAmount ?? 0;
  const last7Days = stats.last7Days ?? [];

  // Data for Pie Chart
  const statusData = [
    { name: 'Resolved', value: resolvedCount },
    { name: 'Pending', value: pendingCount },
    { name: 'Rejected', value: rejectedCount },
  ].filter(item => item.value > 0);

  // Data for Area Chart
  const chartData = last7Days.map(item => ({
    name: item.date.slice(5), // MD format
    count: item.count || 0
  }));

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time overview of system performance and citizen feedback.
          </p>
        </div>

        <button 
          className="btn btn-sm btn-ghost bg-white shadow-sm border border-slate-200 text-gray-600 hover:bg-slate-50 hover:text-primary transition-all" 
          onClick={refreshAll}
        >
          <FiRefreshCw className="mr-2" /> Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Issues"
          value={totalSubmitted}
          icon={<FiFileText className="text-white" />}
          color="bg-blue-500"
          trend="+12% from last week"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          icon={<FiCheckCircle className="text-white" />}
          color="bg-emerald-500"
          trend="94% success rate"
        />
        <StatCard 
          title="Pending Review" 
          value={pendingCount} 
          icon={<FiClock className="text-white" />}
          color="bg-amber-500" 
          trend="Avg wait: 2h 15m"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${paymentsTotalAmount}`} 
          icon={<FiCreditCard className="text-white" />}
          color="bg-indigo-500" 
          trend={`${paymentsCount} transactions`}
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
           <div className="flex items-center justify-between mb-6">
              <div>
                 <h3 className="text-lg font-bold text-gray-900">Issue Reporting Activity</h3>
                 <p className="text-sm text-gray-500">Submissions over the last 7 days</p>
              </div>
              <div className="badge badge-primary bg-primary/10 text-primary border-none gap-1">
                 <FiTrendingUp /> +{last7Days.reduce((acc, curr) => acc + (curr.count || 0), 0)} New
              </div>
           </div>
           
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <defs>
                       <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#64748B', fontSize: 12}}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#64748B', fontSize: 12}}
                    />
                    <Tooltip 
                       contentStyle={{backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: '#fff'}}
                       itemStyle={{color: '#fff'}}
                       cursor={{stroke: '#10B981', strokeWidth: 2}}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="count" 
                       stroke="#10B981" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorCount)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
           <h3 className="text-lg font-bold text-gray-900 mb-2">Resolution Status</h3>
           <p className="text-sm text-gray-500 mb-6">Distribution of issue outcomes</p>
           
           <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={statusData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none'}}
                       itemStyle={{color: '#1E293B'}}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                 </PieChart>
              </ResponsiveContainer>
              {/* Center Text Overlap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center">
                 <div className="text-3xl font-bold text-gray-900">{totalSubmitted}</div>
                 <div className="text-xs text-gray-500 font-medium">Total</div>
              </div>
           </div>
        </div>
      </section>

      {/* Recent Activity Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Latest Issues List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-gray-900">Recent Issues</h3>
              <button 
                onClick={() => navigate("/dashboard/admin/all-issues")}
                className="text-sm text-primary font-medium hover:underline flex items-center"
              >
                View All <FiArrowUpRight className="ml-1"/>
              </button>
           </div>
           
           <div className="divide-y divide-slate-100">
             {latestIssues.length === 0 ? (
               <div className="p-8 text-center text-gray-500">No recent issues found.</div>
             ) : (
                latestIssues.map((issue) => (
                   <div key={issue._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                         issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                         issue.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                         {issue.status === 'resolved' ? <FiCheckCircle /> : issue.status === 'pending' ? <FiClock /> : <FiSlash />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-medium text-gray-900 truncate">{issue.title}</div>
                         <div className="text-xs text-gray-500">
                            {new Date(issue.createdAt).toLocaleDateString()} • {issue.priority} Priority
                         </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/issue-details/${issue._id}`)}
                        className="btn btn-xs btn-ghost text-gray-400 hover:text-primary"
                      >
                         View
                      </button>
                   </div>
                ))
             )}
           </div>
        </div>

        {/* Latest Users List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-gray-900">New Citizens</h3>
              <button 
                onClick={() => navigate("/dashboard/admin/manage-citizens")}
                className="text-sm text-primary font-medium hover:underline flex items-center"
              >
                View All <FiArrowUpRight className="ml-1"/>
              </button>
           </div>
           
           <div className="divide-y divide-slate-100">
             {latestUsers.length === 0 ? (
               <div className="p-8 text-center text-gray-500">No recent users found.</div>
             ) : (
                latestUsers.map((u) => (
                   <div key={u._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="avatar">
                         <div className="w-10 h-10 rounded-full bg-slate-200">
                            <img src={u.photoURL || "https://i.ibb.co/7CQVJNm/default-avatar.png"} alt={u.name} />
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-medium text-gray-900 truncate">{u.name || "Anonymous User"}</div>
                         <div className="text-xs text-gray-500 truncate">{u.email}</div>
                      </div>
                      <div className="text-xs font-medium text-gray-400 bg-slate-100 px-2 py-1 rounded">
                         Citizen
                      </div>
                   </div>
                ))
             )}
           </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
        <p className={`text-xs font-medium ${trend.includes('+') || trend.includes('success') ? 'text-emerald-600' : 'text-gray-400'} flex items-center gap-1`}>
           {trend.includes('+') && <FiTrendingUp />} {trend}
        </p>
      </div>
      <div className={`p-3 rounded-xl shadow-lg shadow-gray-200 ${color} bg-opacity-90`}>
         {icon}
      </div>
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
     <div className="flex justify-between items-center animate-pulse">
        <div className="space-y-2">
           <div className="h-8 w-64 bg-slate-200 rounded"></div>
           <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded"></div>
     </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
           <div key={i} className="bg-white rounded-2xl p-6 shadow-sm h-32 animate-pulse flex justify-between">
               <div className="space-y-3 w-1/2">
                  <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  <div className="h-8 w-16 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-100 rounded"></div>
               </div>
               <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
           </div>
        ))}
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[350px]">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 animate-pulse">
            <div className="flex justify-between mb-8">
               <div className="space-y-2">
                  <div className="h-6 w-48 bg-slate-200 rounded"></div>
                  <div className="h-4 w-32 bg-slate-100 rounded"></div>
               </div>
               <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-48 bg-slate-100 rounded-lg w-full"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse flex flex-col items-center">
            <div className="w-full mb-8 space-y-2">
               <div className="h-6 w-32 bg-slate-200 rounded"></div>
               <div className="h-4 w-48 bg-slate-100 rounded"></div>
            </div>
            <div className="w-40 h-40 rounded-full bg-slate-200 border-8 border-slate-100"></div>
        </div>
     </div>
  </div>
);
