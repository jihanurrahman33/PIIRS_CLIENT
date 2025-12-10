import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import IssueCard from "../../components/IssueCard/IssueCard";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";

const Issues = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  // track which issue(s) are being updated to prevent double clicks
  const [loadingIds, setLoadingIds] = useState(new Set());

  const { data: issues = [] } = useQuery({
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
      <h2 className="text-2xl mb-4">All Issues: {issues.length}</h2>
      <div className="flex justify-between p-4">
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required placeholder="Search" />
        </label>
        <select defaultValue="Filter" className="select">
          <option disabled={true}>filter</option>
          <option>Category</option>
          <option>Status</option>
          <option>Priority</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {issues.map((issue) => (
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

export default Issues;
