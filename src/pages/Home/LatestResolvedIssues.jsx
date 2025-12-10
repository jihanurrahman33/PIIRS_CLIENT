import React, { useState } from "react";
import IssueCard from "../../components/IssueCard/IssueCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const LatestResolvedIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: latestResolvedIssues = [] } = useQuery({
    queryKey: ["latest-resolved-issues", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/issues?status=resolved");
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

    const prevIssues = queryClient.getQueryData(["issues"]) || [];
    const prevLatest =
      queryClient.getQueryData(["latest-resolved-issues", user?.email]) || [];

    // optimistic updates (create new arrays - do not mutate)
    const optimisticIssues = prevIssues.map((it) => {
      if (it._id !== id) return it;
      const hasUpvoted =
        Array.isArray(it.upvoters) && it.upvoters.includes(user.email);
      const newUpvoters = hasUpvoted
        ? it.upvoters.filter((e) => e !== user.email)
        : [...(it.upvoters || []), user.email];
      const newUpvotes = hasUpvoted
        ? Math.max(0, (it.upvotes || 0) - 1)
        : (it.upvotes || 0) + 1;
      return { ...it, upvoters: newUpvoters, upvotes: newUpvotes };
    });

    const optimisticLatest = prevLatest.map((it) => {
      if (it._id !== id) return it;
      const hasUpvoted =
        Array.isArray(it.upvoters) && it.upvoters.includes(user.email);
      const newUpvoters = hasUpvoted
        ? it.upvoters.filter((e) => e !== user.email)
        : [...(it.upvoters || []), user.email];
      const newUpvotes = hasUpvoted
        ? Math.max(0, (it.upvotes || 0) - 1)
        : (it.upvotes || 0) + 1;
      return { ...it, upvoters: newUpvoters, upvotes: newUpvotes };
    });

    queryClient.setQueryData(["issues"], optimisticIssues);
    queryClient.setQueryData(
      ["latest-resolved-issues", user?.email],
      optimisticLatest
    );

    // mark loading (create new Set to trigger rerender)
    setLoadingIds((prev) => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });

    try {
      const res = await axiosSecure.patch(`/issues/${id}/upvote`, {});

      const serverIssue = res.data?.issue;
      const upvoted = res.data?.upvoted;
      const upvotes = res.data?.upvotes;

      if (serverIssue) {
        queryClient.setQueryData(["issues"], (old = []) =>
          old.map((it) => (it._id === id ? serverIssue : it))
        );
        queryClient.setQueryData(
          ["latest-resolved-issues", user?.email],
          (old = []) => old.map((it) => (it._id === id ? serverIssue : it))
        );
      } else {
        // reconcile using upvoted/upvotes returned
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

        queryClient.setQueryData(
          ["latest-resolved-issues", user?.email],
          (old = []) =>
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
      }
    } catch (err) {
      queryClient.setQueryData(["issues"], prevIssues);
      queryClient.setQueryData(
        ["latest-resolved-issues", user?.email],
        prevLatest
      );
      console.error("Upvote failed:", err);
      toast.error("Upvote failed. Please try again.");
    } finally {
      setLoadingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
      queryClient.invalidateQueries(["issues"]);
      queryClient.invalidateQueries(["latest-resolved-issues", user?.email]);
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
