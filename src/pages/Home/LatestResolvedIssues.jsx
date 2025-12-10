import React, { useState } from "react";
import IssueCard from "../../components/IssueCard/IssueCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";

const LatestResolvedIssues = () => {
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  return (
    <div className="p-4">
      <section className="flex justify-between items-center">
        <h2 className="text-2xl">
          Latest Resolved Issues: {latestResolvedIssues.length}
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/all-issues")}
        >
          View All
        </button>
      </section>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {latestResolvedIssues.map((issue) => (
          <IssueCard
            key={issue._id}
            issue={issue}
            onUpvote={() => handleUpVote(issue)}
            onView={() => navigate(`/issue-details/${issue._id}`)}
            disabled={loadingIds.has(issue._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestResolvedIssues;
