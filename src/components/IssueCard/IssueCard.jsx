import React from "react";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";

export default function IssueCard({ issue = {}, onUpvote, onView }) {
  const { user } = useAuth();
  const {
    _id,
    title = "Untitled Issue",
    description = "No description provided.",
    category = "other",
    createdAt,
    createdBy,
    images = [],
    isBoosted = false,
    location = "Unknown location",
    priority = "normal",
    status = "pending",
    upvotes = 0,
  } = issue;

  // helper formats
  const imageSrc =
    images && images.length > 0 ? images[0] : "/placeholder-issue.jpg";
  const shortDesc =
    description.length > 140 ? description.slice(0, 137) + "..." : description;
  const dateText = createdAt ? new Date(createdAt).toLocaleString() : "Unknown";

  // category & status color maps (easy to customize)
  const categoryMap = {
    road: "bg-yellow-100 text-yellow-800",
    lighting: "bg-indigo-100 text-indigo-800",
    water: "bg-cyan-100 text-cyan-800",
    garbage: "bg-emerald-100 text-emerald-800",
    sidewalk: "bg-rose-100 text-rose-800",
    other: "bg-gray-100 text-gray-800",
  };
  const statusMap = {
    pending: "bg-orange-100 text-orange-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };
  const priorityMap = {
    low: "text-green-600",
    normal: "text-gray-700",
    high: "text-red-600 font-semibold",
  };

  const catClass = categoryMap[category] || categoryMap.other;
  const statClass = statusMap[status] || "bg-gray-100 text-gray-800";
  const prClass = priorityMap[priority] || priorityMap.normal;

  return (
    <article
      key={_id}
      className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow max-w-sm w-full"
      role="article"
      aria-labelledby={`issue-${_id}-title`}
    >
      {/* Image hero with overlay badges */}
      <div className="relative w-full h-56 bg-gray-100">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* overlays */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${catClass} shadow-sm`}
          >
            {category?.toUpperCase()}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${statClass} shadow-sm`}
          >
            {status?.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {isBoosted && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded shadow">
              BOOSTED
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <h3
          id={`issue-${_id}-title`}
          className="text-lg font-semibold text-slate-900 line-clamp-2"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600">{shortDesc}</p>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="2.2" fill="currentColor" />
              </svg>
              <span className="max-w-[10rem] truncate">{location}</span>
            </div>

            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="truncate">{createdBy || "Anonymous"}</span>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-xs ${prClass}`}>
              {priority?.toUpperCase()}
            </div>
            <div className="text-[11px] text-gray-400">{dateText}</div>
          </div>
        </div>

        {/* Actions row */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            onClick={() => onUpvote?.(issue)}
            disabled={issue.createdBy === user?.email}
            aria-label="Upvote"
            className="btn inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 transition text-sm"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 21V9" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M5 12l7-7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{upvotes ?? 0}</span>
          </button>

          <button
            onClick={() => onView?.(issue)}
            aria-label="View details"
            className="btn btn-primary btn-sm"
          >
            View detail
          </button>
        </div>
      </div>
    </article>
  );
}

IssueCard.propTypes = {
  issue: PropTypes.object,
  onUpvote: PropTypes.func,
  onView: PropTypes.func,
};
