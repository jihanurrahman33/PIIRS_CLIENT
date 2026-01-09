import React, { useState } from "react";
import IssueCard from "../../components/IssueCard/IssueCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";

const LatestResolvedIssues = () => {
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: latestResolvedIssues = [] } = useQuery({
    queryKey: ["latest-resolved-issues", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/issues?status=resolved");
      return res.data;
    },
  });

  const [loadingIds, setLoadingIds] = useState(new Set());

  const handleUpVote = async (issue) => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    const id = issue._id;
    if (loadingIds.has(id)) return;

    // optimistic update: snapshot current cache
    const previous = queryClient.getQueryData(["issues"]) || [];

    // create new issues array with optimistic changes
    const optimistic = previous.map((it) => {
      if (it._id !== id) return it;
      // If user already in upvoters then server will remove — here we reflect toggle
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

    // apply optimistic update
    queryClient.setQueryData(["issues"], optimistic);

    // mark as loading
    setLoadingIds((prev) => new Set(prev).add(id));

    try {
      // send patch (body empty to avoid form-encoding issues)
      const res = await axiosInstance.patch(`/issues/${id}/upvote`, {});
      // server should return { upvoted: boolean, upvotes: number }
      const { upvoted, upvotes } = res.data || {};

      // reconcile the cache with server result
      queryClient.setQueryData(["issues"], (old = []) =>
        old.map((it) =>
          it._id === id
            ? {
                ...it,
                upvotes: typeof upvotes === "number" ? upvotes : it.upvotes,
                // if server says upvoted true, ensure user's email is present; else remove it
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
      // rollback on error
      queryClient.setQueryData(["issues"], previous);
      console.error("Upvote failed:", err);
      toast.error("Upvote failed. Please try again.");
    } finally {
      // unmark loading
      setLoadingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
      // optional: refetch to be 100% in sync
      queryClient.invalidateQueries(["issues"]);
    }
  };

  if(!latestResolvedIssues || latestResolvedIssues.length === 0) {
      return null; 
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Community Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Recently Resolved Issues
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              See the positive changes happening in our community. Together we are making a difference.
            </p>
          </div>
          
          <Link
            to="/all-issues"
            className="group flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span>View All Issues</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {latestResolvedIssues.slice(0, 4).map((issue) => ( // Ensure we limit to 8 or appropriate number if API returns many
            <div key={issue._id} className="h-full">
                <IssueCard
                    issue={issue}
                    onUpvote={() => handleUpVote(issue)}
                    // Assuming IssueCard doesn't handle navigation internally if onView is passed
                    // But if it does, we can pass a navigate function or just the handler
                />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestResolvedIssues;
