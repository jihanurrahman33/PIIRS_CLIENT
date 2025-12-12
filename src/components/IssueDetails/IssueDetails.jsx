// src/pages/IssueDetails.jsx
import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function IssueDetails() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth() ?? {};
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [upvoting, setUpvoting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const {
    data: issue = null,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["issue-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues/details/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });

  const {
    title = "Untitled Issue",
    description = "",
    category = "other",
    createdAt,
    createdBy,
    images = [],
    isBoosted = false,
    location = "Unknown",
    priority = "normal",
    status = "pending",
    upvotes = 0,
    timeline = [],
  } = issue || {};

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  // Refined Color Maps
  const categoryStyles =
    {
      road: "bg-amber-100 text-amber-800 border-amber-200",
      lighting: "bg-indigo-100 text-indigo-800 border-indigo-200",
      water: "bg-cyan-100 text-cyan-800 border-cyan-200",
      garbage: "bg-emerald-100 text-emerald-800 border-emerald-200",
      sidewalk: "bg-rose-100 text-rose-800 border-rose-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    }[category] || "bg-gray-100 text-gray-800 border-gray-200";

  const statusStyles =
    {
      pending: "bg-orange-50 text-orange-600 ring-orange-500/20",
      in_progress: "bg-blue-50 text-blue-600 ring-blue-500/20",
      resolved: "bg-green-50 text-green-600 ring-green-500/20",
      closed: "bg-gray-50 text-gray-600 ring-gray-500/20",
    }[status] || "bg-gray-50 text-gray-600 ring-gray-500/20";

  const priorityStyles =
    {
      low: "text-gray-500",
      normal: "text-blue-600",
      high: "text-red-600 font-bold",
    }[priority] || "text-gray-500";

  const effectiveTimeline = useMemo(() => {
    if (Array.isArray(timeline) && timeline.length) return timeline;
    return [
      {
        at: createdAt,
        by: createdBy,
        action: "created",
        note: "Issue reported to the system",
      },
    ];
  }, [timeline, createdAt, createdBy]);

  const handleUpvote = async () => {
    if (!user) {
      toast.info("Please log in to upvote.");
      return;
    }
    try {
      setUpvoting(true);
      const res = await axiosSecure.patch(`/issues/${id}/upvote`);
      const newUpvotes = res.data?.upvotes ?? null;

      if (typeof newUpvotes === "number") {
        qc.setQueryData(["issue-details", id], (old) => ({
          ...old,
          upvotes: newUpvotes,
        }));
      } else {
        qc.setQueryData(["issue-details", id], (old) => ({
          ...old,
          upvotes: (old?.upvotes || 0) + 1,
        }));
      }
      toast.success("Vote recorded!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Could not upvote");
    } finally {
      setUpvoting(false);
    }
  };

  // -- Loading State --
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // -- Error State --
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Unable to load issue
          </h3>
          <p className="text-gray-500 mb-6">{error?.message}</p>
          <div className="flex gap-3 justify-center">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <button
              className="btn btn-error text-white"
              onClick={() => qc.invalidateQueries(["issue-details", id])}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Breadcrumb / Top Nav */}
      <div className="bg-white border-b sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back to Issues
          </button>
          <div className="flex gap-2">
            {/* Simple Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title,
                    text: description,
                    url: window.location.href,
                  });
                } else {
                  toast.info("Link copied to clipboard");
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="btn btn-sm btn-ghost font-normal text-gray-600"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Images & Description (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Section (Mobile/Desktop friendly) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${categoryStyles}`}
                >
                  {category}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md ring-1 ring-inset ${statusStyles}`}
                >
                  {status?.replace("_", " ").toUpperCase()}
                </span>
                {isBoosted && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    BOOSTED 🚀
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {createdBy || "Anonymous"}
                </span>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-video bg-gray-100 group">
                <img
                  src={
                    images.length > 0
                      ? images[activeImage]
                      : "/placeholder-issue.jpg"
                  }
                  alt={title}
                  className="w-full h-full object-contain bg-gray-900/5 transition-transform duration-500"
                />

                {/* Image Navigation Dots (Overlay) */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                          idx === activeImage
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div className="flex gap-3 p-4 overflow-x-auto bg-gray-50 border-t border-gray-100 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === idx
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Description
              </h3>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                {description || "No description provided."}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar / Actions (Span 4) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Action Card: Upvote */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 tracking-tighter mb-1">
                  {upvotes}
                </div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Community Upvotes
                </div>
              </div>

              <button
                onClick={handleUpvote}
                disabled={upvoting}
                className={`w-full btn btn-lg h-14 text-lg border-none shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                  upvoting
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                }`}
              >
                {upvoting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    Support Issue
                  </>
                )}
              </button>
              <p className="text-xs text-center text-gray-400 mt-4">
                Voting helps prioritize resolution in {location}.
              </p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Location & Priority
              </h4>

              <div className="flex items-start gap-3 mb-4">
                <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{location}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Approximate location
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="text-sm text-gray-500">Urgency Level:</div>
                <div className={`font-semibold ${priorityStyles}`}>
                  {priority?.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Timeline Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
                Activity Timeline
              </h4>

              <div className="space-y-0">
                {effectiveTimeline.map((t, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {/* Vertical Line */}
                    {i !== effectiveTimeline.length - 1 && (
                      <div className="absolute left-[11px] top-8 bottom-[-8px] w-0.5 bg-gray-100"></div>
                    )}

                    {/* Dot */}
                    <div className="relative z-10 w-6 h-6 flex-shrink-0 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="pb-8">
                      <p className="text-sm font-semibold text-gray-900">
                        {t.action
                          ? t.action.charAt(0).toUpperCase() + t.action.slice(1)
                          : "Update"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        {t.at ? new Date(t.at).toLocaleString() : ""}
                      </p>
                      {t.note && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {t.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
