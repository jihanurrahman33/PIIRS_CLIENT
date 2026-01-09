import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import IssueCard from "../../components/IssueCard/IssueCard";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";
import { FaSearch, FaFilter } from "react-icons/fa";

const Issues = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  // track which issue(s) are being updated to prevent double clicks
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["issues", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/issues/all");
      return res.data;
    },
  });

  const handleUpVote = async (issue) => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    const id = issue._id;
    if (loadingIds.has(id)) return; // prevent double requests

    // optimistic update: snapshot current cache
    const previous = queryClient.getQueryData(["issues"]) || [];

    // create new issues array with optimistic changes
    const optimistic = previous.map((it) => {
      if (it._id !== id) return it;
      const hasUpvoted =
        Array.isArray(it.upvoters) && it.upvoters.includes(user.email);
      const newUpvoters = hasUpvoted
        ? it.upvoters.filter((e) => e !== user.email)
        : [...(it.upvoters || []), user.email];
      const newUpvotes = hasUpvoted
        ? Math.max(0, (it.upvotes || 0) - 1)
        : (it.upvotes || 0) + 1;

      return {
        ...it,
        upvoters: newUpvoters,
        upvotes: newUpvotes,
      };
    });

    queryClient.setQueryData(["issues"], optimistic);
    setLoadingIds((prev) => new Set(prev).add(id));

    try {
      const res = await axiosInstance.patch(`/issues/${id}/upvote`, {});
      const { upvoted, upvotes } = res.data || {};

      queryClient.setQueryData(["issues"], (old = []) =>
        old.map((it) =>
          it._id === id
            ? {
                ...it,
                upvotes: typeof upvotes === "number" ? upvotes : it.upvotes,
                upvoters: upvoted
                  ? Array.isArray(it.upvoters) &&
                    it.upvoters.includes(user.email)
                    ? it.upvoters
                    : [...(it.upvoters || []), user.email]
                  : Array.isArray(it.upvoters)
                  ? it.upvoters.filter((e) => e !== user.email)
                  : [],
              }
            : it
        )
      );
    } catch (err) {
      queryClient.setQueryData(["issues"], previous);
      console.error("Upvote failed:", err);
      toast.error("Upvote failed. Please try again.");
    } finally {
      setLoadingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
      queryClient.invalidateQueries(["issues"]);
    }
  };

  // Filter Logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || issue.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Community Reports</h2>
           <p className="text-gray-500 mt-2 text-lg">Browse, track, and support infrastructure improvements in your area.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center bg-white rounded-full shadow-lg border border-slate-100 p-2 w-full max-w-2xl mx-auto mb-12 relative z-10">
           
           {/* Search Input Part */}
           <div className="flex-1 flex items-center px-4">
              <FaSearch className="text-gray-400 mr-3" />
              <input 
                 type="text" 
                 placeholder="Search by title or description..." 
                 className="w-full bg-transparent focus:outline-none text-gray-700 font-medium placeholder-gray-400"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           {/* Divider */}
           <div className="w-px h-8 bg-slate-200 mx-2"></div>

           {/* Filter Part */}
           <div className="flex-shrink-0 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <FaFilter className="text-brand-emerald text-xs" />
              </div>
              <select 
                 className="appearance-none bg-slate-50 hover:bg-slate-100 text-gray-600 font-semibold py-2.5 pl-9 pr-10 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                 value={filterCategory}
                 onChange={(e) => setFilterCategory(e.target.value)}
              >
                 <option value="All">All Categories</option>
                 <option value="Road">Roads</option>
                 <option value="Lighting">Lighting</option>
                 <option value="Water">Water</option>
                 <option value="Waste">Waste</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
           </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between">
                     <div className="h-4 w-20 bg-slate-200 rounded"></div>
                     <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  <div className="space-y-2">
                     <div className="h-4 w-full bg-slate-200 rounded"></div>
                     <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                     <div className="h-4 w-24 bg-slate-200 rounded"></div>
                     <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredIssues.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentIssues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  onUpvote={() => handleUpVote(issue)}
                  onView={() => navigate(`/issue-details/${issue._id}`)}
                  disabled={loadingIds.has(issue._id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                 <button 
                    className="btn btn-sm btn-circle bg-white border-slate-200 hover:bg-slate-50 text-slate-500 disabled:bg-slate-50 disabled:text-slate-300"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                 >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                 </button>
                 
                 <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                       <button
                          key={i + 1}
                          className={`btn btn-sm btn-circle ${
                             currentPage === i + 1 
                                ? "bg-primary text-white border-primary hover:bg-primary" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                          onClick={() => handlePageChange(i + 1)}
                       >
                          {i + 1}
                       </button>
                    ))}
                 </div>

                 <button 
                    className="btn btn-sm btn-circle bg-white border-slate-200 hover:bg-slate-50 text-slate-500 disabled:bg-slate-50 disabled:text-slate-300"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                 >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                 </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <FaSearch size={24} />
             </div>
             <h3 className="text-lg font-semibold text-gray-900">No issues found</h3>
             <p className="text-gray-500 max-w-sm mx-auto mt-2">Try adjusting your search terms or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Issues;
