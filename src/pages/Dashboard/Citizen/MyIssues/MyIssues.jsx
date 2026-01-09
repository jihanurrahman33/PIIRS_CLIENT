import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router";
import { FaPlus, FaSearch, FaEye, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaClock } from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const MyIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  
  const { data: myIssues = [], isLoading } = useQuery({
    queryKey: ["my-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-issues");
      return res.data;
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><FaCheckCircle className="mr-1"/> Resolved</span>;
      case "pending": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><FaClock className="mr-1"/> Pending</span>;
      case "rejected": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><FaExclamationCircle className="mr-1"/> Rejected</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (isLoading) {
    return <MyIssuesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
           <p className="text-gray-500 text-sm">Track and manage your reported issues.</p>
        </div>
        <Link to="/report-issue" className="btn btn-primary shadow-lg shadow-primary/30">
           <FaPlus className="mr-2" /> Report New Issue
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        {myIssues.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-4xl">
                  <FaSearch />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">No issues found</h3>
               <p className="text-gray-500 max-w-sm mx-auto mb-8">You haven't reported any issues yet. Help improve your community by reporting a problem today.</p>
               <Link to="/report-issue" className="btn btn-outline btn-primary">Report an Issue</Link>
           </div>
        ) : (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="table w-full">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                       <tr>
                          <th className="py-4 pl-6">#</th>
                          <th className="py-4">Issue Details</th>
                          <th className="py-4">Date Reported</th>
                          <th className="py-4 text-center">Status</th>
                          <th className="py-4 pr-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {myIssues.map((issue, index) => (
                          <tr key={issue._id} className="hover:bg-slate-50/50 transition-colors group">
                             <th className="pl-6 text-slate-400 font-normal">{index + 1}</th>
                             <td>
                                <div className="flex items-center gap-4">
                                   <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                      <img 
                                        src={issue.images?.[0] || "https://i.ibb.co/YyYgL1v/placeholder.jpg"} 
                                        alt={issue.title} 
                                        className="w-full h-full object-cover"
                                      />
                                   </div>
                                   <div>
                                      <div className="font-bold text-gray-900 line-clamp-1">{issue.title}</div>
                                      <div className="text-xs text-gray-400">ID: {issue._id.slice(-6)}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="text-gray-600 font-medium">
                                <div className="flex items-center gap-2">
                                  <FaCalendarAlt className="text-gray-300 text-xs" />
                                  {new Date(issue.createdAt).toLocaleDateString()}
                                </div>
                             </td>
                             <td className="text-center">
                                {getStatusBadge(issue.status)}
                             </td>
                             <td className="text-right pr-6">
                                <Link 
                                  to={`/issue-details/${issue._id}`} 
                                  className="btn btn-sm btn-ghost text-brand-emerald hover:bg-emerald-50 hover:text-brand-emerald"
                                >
                                   <FaEye className="mr-1" /> View Details
                                </Link>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

const MyIssuesSkeleton = () => (
   <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center animate-pulse">
         <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded"></div>
            <div className="h-4 w-64 bg-slate-200 rounded"></div>
         </div>
         <div className="h-10 w-40 bg-slate-200 rounded-lg"></div>
      </div>
      
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
             <div className="h-6 w-8 bg-slate-200 rounded"></div>
             <div className="h-6 w-48 bg-slate-200 rounded"></div>
             <div className="h-6 w-32 bg-slate-200 rounded"></div>
             <div className="h-6 w-24 bg-slate-200 rounded ml-auto"></div>
         </div>
         <div className="divide-y divide-slate-100">
             {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 flex items-center gap-6 animate-pulse">
                   <div className="h-4 w-4 bg-slate-100 rounded"></div>
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-slate-200"></div>
                      <div className="space-y-2">
                         <div className="h-4 w-48 bg-slate-200 rounded"></div>
                         <div className="h-3 w-16 bg-slate-100 rounded"></div>
                      </div>
                   </div>
                   <div className="flex-1">
                       <div className="h-4 w-32 bg-slate-100 rounded"></div>
                   </div>
                   <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                   <div className="h-8 w-28 bg-slate-200 rounded ml-auto"></div>
                </div>
             ))}
         </div>
      </div>
   </div>
);

export default MyIssues;
