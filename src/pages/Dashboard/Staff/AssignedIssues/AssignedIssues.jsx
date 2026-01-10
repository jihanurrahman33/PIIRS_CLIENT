import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { 
    FaSearch, 
    FaFilter, 
    FaMapMarkerAlt, 
    FaCalendarAlt, 
    FaCheckCircle,
    FaArrowRight,
    FaExternalLinkAlt
} from "react-icons/fa";

import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AssignedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);

  const { data: assignedIssues = [], refetch, isLoading } = useQuery({
    queryKey: ["assignedIssues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/${user?.email}/assinedTask`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleStatusChange = async (e, issue) => {
    const newStatus = e.target.value;
    if (!newStatus || newStatus === issue.status) return;

    setLoadingId(issue._id);
    try {
      await axiosSecure.patch(`/issues/${issue._id}/status`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  // Filter logic
  const filteredIssues = assignedIssues.filter(issue => {
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue._id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
      const isNotRejected = issue.status !== "rejected"; // Assuming we still hide rejected here based on previous code

      return matchesSearch && matchesStatus && isNotRejected;
  });

  const getPriorityBadge = (priority) => {
      switch(priority) {
          case 'high': return <span className="badge badge-error gap-1 text-white font-bold text-xs uppercase"><span className="w-1.5 h-1.5 rounded-full bg-white"></span> High</span>;
          case 'medium': return <span className="badge badge-warning gap-1 text-white font-bold text-xs uppercase"><span className="w-1.5 h-1.5 rounded-full bg-white"></span> Medium</span>;
          default: return <span className="badge badge-info gap-1 text-white font-bold text-xs uppercase"><span className="w-1.5 h-1.5 rounded-full bg-white"></span> Normal</span>;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="text-sm font-bold text-brand-emerald mb-1 uppercase tracking-wider">Work Management</div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assigned Tasks</h1>
           <p className="text-slate-500 mt-2 text-lg max-w-2xl">
              Manage and track all infrastructure issues assigned to you. Keep statuses updated for better community visibility.
           </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Pending</div>
                <div className="text-xl font-black text-slate-900">{filteredIssues.length}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-emerald flex items-center justify-center">
                <FaCheckCircle className="text-xl" />
            </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-slate-400" />
             </div>
             <input 
                type="text" 
                placeholder="Search by title, location, or ID..." 
                className="input input-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-emerald transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          {/* Status Filter */}
          <div className="relative w-full md:w-auto min-w-[200px]">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-slate-400" />
             </div>
             <select 
                className="select select-bordered w-full pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-emerald"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
             >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="staff-assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="working">Working</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
             </select>
          </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
             <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                            <th className="py-4 pl-6 font-bold">Issue Details</th>
                            <th className="py-4 font-bold">Priority</th>
                            <th className="py-4 font-bold">Location</th>
                            <th className="py-4 font-bold">Status Update</th>
                            <th className="py-4 pr-6 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-slate-50 last:border-none animate-pulse">
                                <td className="pl-6 py-4 max-w-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0"></div>
                                        <div className="space-y-2 w-full">
                                            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
                                </td>
                                <td className="py-4">
                                    <div className="h-4 w-24 bg-slate-100 rounded"></div>
                                </td>
                                <td className="py-4">
                                    <div className="h-8 w-28 bg-slate-100 rounded-lg"></div>
                                </td>
                                <td className="py-4 pr-6 text-right">
                                    <div className="h-8 w-16 bg-slate-100 rounded-lg ml-auto"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : filteredIssues.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* Head */}
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                            <th className="py-4 pl-6 font-bold">Issue Details</th>
                            <th className="py-4 font-bold">Priority</th>
                            <th className="py-4 font-bold">Location</th>
                            <th className="py-4 font-bold">Status Update</th>
                            <th className="py-4 pr-6 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIssues.map((issue) => (
                            <tr key={issue._id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                                <td className="pl-6 py-4 max-w-sm">
                                    <div className="flex items-start gap-4">
                                        {/* Thumbnail if available, else placeholder */}
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                            {issue.images && issue.images.length > 0 ? (
                                                <img src={issue.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-brand-emerald transition-colors">
                                                {issue.title}
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">#{issue._id.slice(-6).toUpperCase()}</span>
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt className="text-slate-300" />
                                                    {new Date(issue.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    {getPriorityBadge(issue.priority)}
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <FaMapMarkerAlt className="text-slate-400" />
                                        <span className="truncate max-w-[150px]" title={issue.location}>{issue.location}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="relative">
                                        <select 
                                            className={`select select-sm select-bordered w-full max-w-[160px] font-semibold text-xs transition-all ${
                                                loadingId === issue._id ? 'opacity-50 cursor-not-allowed' : 'bg-white'
                                            } ${
                                                issue.status === 'resolved' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                                                issue.status === 'in-progress' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                                'border-slate-200 text-slate-600'
                                            }`}
                                            value={issue.status || ""}
                                            onChange={(e) => handleStatusChange(e, issue)}
                                            disabled={loadingId === issue._id}
                                        >
                                            <option disabled value="">Set Status</option>
                                            <option value="staff-assigned">Assigned</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="working">Working</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                        {loadingId === issue._id && (
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                                <span className="loading loading-spinner loading-xs text-brand-emerald"></span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 pr-6 text-right">
                                    <button 
                                        className="btn btn-sm btn-ghost text-slate-500 hover:text-brand-emerald hover:bg-emerald-50"
                                        onClick={() => navigate(`/issue-details/${issue._id}`)}
                                        title="View Details"
                                    >
                                        View
                                        <FaArrowRight className="ml-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
             <div className="py-20 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <FaSearch className="text-2xl text-slate-300" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">No issues found</h3>
                 <p className="text-slate-500 max-w-xs mt-2">
                    Try adjusting your search terms or filters to find what you're looking for.
                 </p>
                 <button 
                    className="btn btn-link text-brand-emerald no-underline"
                    onClick={() => {setSearchTerm(""); setStatusFilter("all");}}
                 >
                    Clear Filters
                 </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default AssignedIssues;
