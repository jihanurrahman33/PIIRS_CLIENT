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
    images && images.length > 0 ? images[0] : "https://placehold.co/600x400?text=No+Image";
  const shortDesc =
    description.length > 100 ? description.slice(0, 97) + "..." : description;
  const dateText = createdAt ? new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown";

  // category & status color maps
  const categoryMap = {
    road: "bg-amber-100 text-amber-800",
    lighting: "bg-indigo-100 text-indigo-800",
    water: "bg-blue-100 text-blue-800",
    garbage: "bg-emerald-100 text-emerald-800",
    sidewalk: "bg-rose-100 text-rose-800",
    other: "bg-gray-100 text-gray-800",
  };
  
  const statusMap = {
    pending: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    in_progress: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    resolved: "bg-green-100 text-green-700 ring-1 ring-green-200",
    closed: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  };

  const priorityMap = {
    low: "text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium",
    normal: "text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-medium",
    high: "text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium",
  };

  const catClass = categoryMap[category] || categoryMap.other;
  const statClass = statusMap[status] || statusMap.pending;
  const prClass = priorityMap[priority] || priorityMap.normal;

  return (
    <article
      className="group flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200"
      role="article"
      aria-labelledby={`issue-${_id}-title`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm backdrop-blur-sm bg-white/90 ${catClass.split(' ')[1]}`}>
               {category?.charAt(0).toUpperCase() + category?.slice(1)}
            </span>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {isBoosted && (
                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] uppercase font-bold tracking-wider rounded shadow-sm">
                    Boosted
                </span>
            )}
             <span className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm ${statClass}`}>
                {status?.replace("_", " ").toUpperCase()}
            </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 flex flex-col gap-4">
        <div className="space-y-2">
             <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {dateText}
                </span>
                 <span className={prClass}>
                    {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
                </span>
             </div>
            
            <h3
            id={`issue-${_id}-title`}
            className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors"
            >
            {title}
            </h3>
            
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {shortDesc}
            </p>
        </div>

        {/* Location & Author */}
        <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
             <div className="flex items-center gap-1.5 truncate">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate" title={location}>{location}</span>
             </div>
             <div className="flex items-center gap-1.5 justify-end truncate">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">Citizen</span>
             </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-3">
        <button
          onClick={() => onUpvote?.(issue)}
          disabled={issue.createdBy === user?.email}
          aria-label="Upvote"
          className="btn btn-sm btn-ghost gap-2 text-gray-600 hover:text-primary hover:bg-primary/5 disabled:bg-transparent"
        >
          <svg
            className={`w-5 h-5 ${upvotes > 0 ? 'fill-current text-primary' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <span className="font-semibold">{upvotes ?? 0}</span>
        </button>

        <button
          onClick={() => onView?.(issue)}
          aria-label="View details"
          className="btn btn-primary btn-sm px-6 shadow-sm shadow-primary/20 hover:shadow-primary/40"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

IssueCard.propTypes = {
  issue: PropTypes.object,
  onUpvote: PropTypes.func,
  onView: PropTypes.func,
};

