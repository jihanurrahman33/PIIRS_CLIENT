// src/pages/IssueDetails.jsx
import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { 
  FaArrowLeft, 
  FaShareAlt, 
  FaCheck, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaArrowUp,
  FaExclamationTriangle,
  FaHardHat,
  FaClipboardCheck
} from "react-icons/fa";

export default function IssueDetails() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth() ?? {};
  const navigate = useNavigate();
  const location = useLocation();
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
    location: issueLocation = "Unknown",
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

  // -- STEPS CONFIG --
  // We map the current status to a step index (0, 1, or 2)
  const steps = [
    { id: 'pending', label: 'Reported', icon: FaClipboardCheck },
    { id: 'in_progress', label: 'In Progress', icon: FaHardHat },
    { id: 'resolved', label: 'Resolved', icon: FaCheck }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);
  // If status is 'closed' or unknown, default to max or 0
  const activeStep = currentStepIndex === -1 ? (status === 'closed' ? 3 : 0) : currentStepIndex;

  const handleUpvote = async () => {
    if (!user) {
      toast.info("Please log in to upvote.");
      navigate("/login", { state: { from: location } });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-brand-emerald"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-red-100">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to load issue</h3>
          <p className="text-gray-500 mb-6">{error?.message}</p>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Navbar / Top Control */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-emerald transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="hidden sm:inline font-mono">ID: #{id?.slice(-6).toUpperCase()}</span>
            <button
               onClick={() => {
                 const url = window.location.href;
                 navigator.clipboard.writeText(url);
                 toast.success("Link copied!");
               }}
               className="btn btn-sm btn-ghost btn-square"
            >
               <FaShareAlt />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* 2. Status Tracker Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Info */}
              <div className="text-center md:text-left">
                 <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</h2>
                 <div className={`text-2xl font-black uppercase tracking-tight ${
                    status === 'resolved' ? 'text-brand-emerald' : 
                    status === 'in_progress' ? 'text-blue-600' : 'text-amber-500'
                 }`}>
                    {status?.replace("_", " ")}
                 </div>
                 <div className="text-sm text-gray-500 mt-1">Last updated today</div>
              </div>

              {/* Stepper */}
              <div className="flex-1 w-full max-w-2xl">
                 <ul className="steps w-full">
                    {steps.map((step, idx) => (
                       <li 
                          key={step.id} 
                          className={`step ${idx <= activeStep ? 'step-primary before:!bg-brand-emerald after:!bg-brand-emerald' : ''}`}
                          data-content={idx <= activeStep ? "✓" : "●"}
                       >
                          <span className={`text-xs font-bold mt-2 ${idx <= activeStep ? 'text-gray-900' : 'text-gray-400'}`}>
                             {step.label}
                          </span>
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Evidence & Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* Main Info */}
             <div>
                <div className="flex items-center gap-3 mb-3">
                   <div className="badge badge-lg border-transparent bg-slate-100 text-slate-600 font-bold uppercase text-xs tracking-wide">
                      {category}
                   </div>
                   {isBoosted && <div className="badge badge-lg border-transparent bg-red-100 text-red-600 font-bold uppercase text-xs tracking-wide">High Priority</div>}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                   {title}
                </h1>
                <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                   <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400"/> {formattedDate}
                   </span>
                   <span className="flex items-center gap-1">
                      by <span className="text-gray-900">{createdBy || "Anonymous"}</span>
                   </span>
                </div>
             </div>

            {/* Evidence Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Evidence Photo</h3>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{images.length} FILES</span>
               </div>
               
               {images.length > 0 ? (
                  <div className="bg-slate-50 p-1">
                     <div className="relative aspect-video rounded-xl overflow-hidden bg-white shadow-inner group">
                        <img 
                           src={images[activeImage]} 
                           alt="Evidence" 
                           className="w-full h-full object-contain"
                        />
                     </div>
                     {images.length > 1 && (
                        <div className="flex gap-2 mt-2 px-1 pb-1 overflow-x-auto">
                           {images.map((img, idx) => (
                              <button 
                                 key={idx}
                                 onClick={() => setActiveImage(idx)}
                                 className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                    activeImage === idx ? 'border-brand-emerald opacity-100' : 'border-slate-200 opacity-60 hover:opacity-100'
                                 }`}
                              >
                                 <img src={img} className="w-full h-full object-cover" />
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="h-48 flex flex-col items-center justify-center bg-slate-50 text-gray-400">
                     <FaExclamationTriangle className="text-3xl mb-2 opacity-20" />
                     <span className="text-sm">No visual evidence provided</span>
                  </div>
               )}
            </div>

            {/* Description Text */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
               <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-slate-100 pb-2">Description</h3>
               <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {description}
               </p>
            </div>

          </div>

          {/* RIGHT: Actions & Context (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
             
             {/* Action Card */}
             <div className="bg-white rounded-2xl shadow-lg border-t-4 border-brand-emerald p-6 z-20">
                <div className="flex justify-between items-end mb-6">
                   <div>
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Community Votes</div>
                      <div className="text-4xl font-extrabold text-gray-900">{upvotes}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</div>
                      <div className={`text-lg font-bold ${priority === 'high' ? 'text-red-500' : 'text-blue-500'}`}>
                         {priority?.toUpperCase()}
                      </div>
                   </div>
                </div>

                <button 
                   onClick={handleUpvote}
                   disabled={upvoting}
                   className="btn btn-lg w-full bg-brand-emerald hover:bg-emerald-600 text-white border-none shadow-lg shadow-brand-emerald/20 flex items-center gap-2"
                >
                   {upvoting ? <span className="loading loading-spinner"></span> : <FaArrowUp />}
                   ENDORSE THIS ISSUE
                </button>
                <p className="text-xs text-center text-gray-400 mt-3 px-4">
                   Endorsing helps the impact team prioritize this fix.
                </p>
             </div>

             {/* Location Widget */}
             <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-start gap-4">
                   <FaMapMarkerAlt className="text-brand-emerald text-xl mt-1" />
                   <div>
                      <h3 className="font-bold text-lg mb-1">Location</h3>
                      <p className="text-slate-300 leading-snug">{issueLocation}</p>
                   </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700">
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Investigation Log</div>
                   <div className="space-y-4">
                      {timeline && timeline.length > 0 ? timeline.map((t, i) => (
                         <div key={i} className="flex gap-3 text-sm">
                            <div className="text-slate-400 w-24 flex-shrink-0 text-xs py-1">
                               {new Date(t.at).toLocaleDateString()}
                            </div>
                            <div>
                               <div className="font-bold text-white">{t.action}</div>
                               <div className="text-slate-400 text-xs">{t.note}</div>
                            </div>
                         </div>
                      )) : (
                         <div className="text-slate-500 text-sm italic">No updates recorded yet.</div>
                      )}
                      
                      {/* Initial Created Log */}
                       <div className="flex gap-3 text-sm opacity-50">
                         <div className="text-slate-400 w-24 flex-shrink-0 text-xs py-1">
                            {new Date(createdAt).toLocaleDateString()}
                         </div>
                         <div>
                            <div className="font-bold text-white">Reported</div>
                            <div className="text-slate-400 text-xs">Issue submitted by user</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
