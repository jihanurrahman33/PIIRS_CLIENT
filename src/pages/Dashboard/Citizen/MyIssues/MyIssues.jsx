import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router";
import { FaPlus, FaSearch } from "react-icons/fa";
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
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myIssues.map((issue) => (
                 <div key={issue._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                    <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                       <img 
                          src={issue.images?.[0] || "https://i.ibb.co/YyYgL1v/placeholder.jpg"} 
                          alt={issue.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                       <div className="absolute top-3 right-3">
                          <span className={`badge border-none text-white font-medium capitalize py-3 px-3 ${
                             issue.status === 'resolved' ? 'bg-green-500' : 
                             issue.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                          }`}>
                             {issue.status}
                          </span>
                       </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                       <h3 className="font-bold text-gray-900 mb-2 truncate text-lg">{issue.title}</h3>
                       <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{issue.description}</p>
                       
                       <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                          <span className="text-xs text-gray-400 font-medium">
                             {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                          <Link to={`/issue-details/${issue._id}`} className="btn btn-sm btn-ghost text-brand-emerald hover:bg-brand-emerald/10">
                             View Details
                          </Link>
                       </div>
                    </div>
                 </div>
              ))}
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
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[380px] animate-pulse">
               <div className="h-48 bg-slate-200 w-full"></div>
               <div className="p-5 space-y-4">
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  <div className="space-y-2">
                     <div className="h-4 w-full bg-slate-100 rounded"></div>
                     <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                  </div>
                  <div className="pt-6 mt-4 flex justify-between items-center border-t border-slate-100">
                     <div className="h-4 w-20 bg-slate-100 rounded"></div>
                     <div className="h-8 w-24 bg-slate-200 rounded"></div>
                  </div>
               </div>
            </div>
         ))}
      </div>
   </div>
);

export default MyIssues;
