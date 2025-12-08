// src/pages/IssueDetails.jsx
import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

/**
 * Professional IssueDetails UI
 * - Two-column responsive layout
 * - Image carousel (basic), metadata, description, timeline
 * - Prominent upvote CTA
 *
 * Assumes same endpoints as before.
 */
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

  // Destructure with defaults
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
    ? new Date(createdAt).toLocaleString()
    : "Unknown";

  // color maps (refined)
  const categoryClass =
    {
      road: "bg-yellow-50 text-yellow-800",
      lighting: "bg-indigo-50 text-indigo-800",
      water: "bg-cyan-50 text-cyan-800",
      garbage: "bg-emerald-50 text-emerald-800",
      sidewalk: "bg-rose-50 text-rose-800",
      other: "bg-gray-50 text-gray-800",
    }[category] || "bg-gray-50 text-gray-800";

  const statusClass =
    {
      pending: "bg-orange-50 text-orange-800",
      in_progress: "bg-yellow-50 text-yellow-800",
      resolved: "bg-green-50 text-green-800",
      closed: "bg-gray-50 text-gray-800",
    }[status] || "bg-gray-50 text-gray-800";

  const priorityClass =
    {
      low: "text-green-600",
      normal: "text-gray-700",
      high: "text-red-600 font-semibold",
    }[priority] || "text-gray-700";

  const effectiveTimeline = useMemo(() => {
    if (Array.isArray(timeline) && timeline.length) return timeline;
    return [
      {
        at: createdAt,
        by: createdBy,
        action: "created",
        note: "Issue reported",
      },
    ];
  }, [timeline, createdAt, createdBy]);

  // Upvote action
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

      toast.success("Upvoted — thanks!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Could not upvote");
    } finally {
      setUpvoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-gray-600">Loading issue...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load issue</p>
          <p className="text-sm text-gray-600 mb-4">{error?.message}</p>
          <div className="flex gap-2 justify-center">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => qc.invalidateQueries(["issue-details", id])}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
            <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
            {isBoosted && (
              <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                BOOSTED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title,
                      text: description,
                      url: window.location.href,
                    })
                  : toast.info("Share not supported on this browser")
              }
            >
              Share
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Images (span 7) */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* main image */}
              <div className="w-full h-[420px] bg-gray-100 relative">
                <img
                  src={
                    images && images.length > 0
                      ? images[activeImage]
                      : "/placeholder-issue.jpg"
                  }
                  alt={title}
                  className="w-full h-full object-cover"
                />
                {/* image index indicator */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 px-2 py-1 rounded">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-2 h-2 rounded-full ${
                          i === activeImage ? "bg-white" : "bg-white/40"
                        }`}
                        aria-label={`Show image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
                {/* top-left pills */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${categoryClass}`}
                  >
                    {category?.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${statusClass}`}>
                    {status?.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                {/* top-right priority */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-2 py-1 text-xs rounded bg-white/90 ${priorityClass}`}
                  >
                    Priority: {priority?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* small gallery thumbnails */}
              {images.length > 1 && (
                <div className="p-3 border-t flex items-center gap-3 bg-gray-50 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`rounded border ${
                        i === activeImage ? "ring-2 ring-primary" : "opacity-80"
                      } overflow-hidden`}
                      style={{ width: 88, height: 64 }}
                      aria-label={`Thumbnail ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Details (span 5) */}
          <aside className="md:col-span-5">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {shorten(description, 200)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">Reported</div>
                  <div className="font-medium">{createdBy}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formattedDate}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 11.5a2.5 2.5 0 10 0-5 2.5 2.5 0 000 5z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 11.5c0 6-9 10.5-9 10.5S3 17.5 3 11.5A9 9 0 1121 11.5z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>{location}</div>
              </div>

              {/* Description expanded */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Upvote CTA */}
              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUpvote}
                    disabled={upvoting}
                    className={`btn btn-primary btn-lg flex-1 ${
                      upvoting ? "loading" : ""
                    }`}
                    aria-label="Upvote"
                  >
                    👍 Upvote
                  </button>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Support</div>
                    <div className="text-xl font-semibold">{upvotes}</div>
                  </div>
                </div>

                {/* small helper */}
                <p className="text-xs text-gray-400 mt-2">
                  Upvoting helps prioritize issues in your area.
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Timeline
                </h4>
                <ol className="border-l border-gray-100 pl-4 space-y-4">
                  {effectiveTimeline.map((t, i) => (
                    <li key={i} className="relative pb-2">
                      <span className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-primary" />
                      <div className="text-sm font-medium text-gray-700">
                        {(t.action || "update").toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">{t.note}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {t.by || ""} •{" "}
                        {t.at ? new Date(t.at).toLocaleString() : ""}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Footer small actions */}
              <div className="mt-6 flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    navigator.share
                      ? navigator.share({
                          title,
                          text: description,
                          url: window.location.href,
                        })
                      : toast.info("Share not supported")
                  }
                >
                  Share
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* tiny helper: shorten text (keeps whole words) */
function shorten(text = "", max = 140) {
  if (!text) return "";
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace > 30 ? lastSpace : max) + "...";
}
