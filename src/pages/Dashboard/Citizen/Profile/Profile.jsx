// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FaUser, FaCrown, FaHistory, FaMapMarkerAlt, FaPhone, FaCamera, FaSave, FaTimes, FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

export default function Profile() {
  const { user, logOut } = useAuth() ?? {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      photoURL: "",
    },
  });
  const [subscribing, setSubscribing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [countInfo, setCountInfo] = useState({
    count: 0,
    isPremium: false,
    limit: 3,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [saving, setSaving] = useState(false);
  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    try {
      setSubscribing(true);
      const res = await axiosSecure.post("/create-checkout-session");
      const data = res?.data || {};

      // Preferred: server returned a complete URL to redirect
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Fallback: server returned session id — attempt to redirect to Checkout
      if (data.id) {
        // Usually server returns URL — but if only id present, try client redirect via Stripe.js (optional)
        // You can also construct a url, but Stripe Checkout URL is safer from the server.
        // As a simple fallback, open Stripe-hosted page:
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
        return;
      }

      toast.error("Failed to create checkout session");
    } catch (err) {
      console.error("create-checkout-session error:", err);
      toast.error(err.response?.data?.error || "Unable to start checkout");
    } finally {
      setSubscribing(false);
    }
  };
  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");

    if (canceled) {
      toast.info("Payment canceled");
      // remove canceled param
      try {
        const u = new URL(window.location.href);
        u.searchParams.delete("canceled");
        window.history.replaceState({}, "", u.toString());
      } catch (e) {}
    }

    if (!sessionId) return () => (mounted = false);

    (async () => {
      try {
        toast.info("Verifying payment...");
        const res = await axiosSecure.patch("/payment-success", null, {
          params: { session_id: sessionId },
        });

        if (!mounted) return;

        const data = res?.data || {};
        if (data.success) {
          toast.success("Payment successful — you are now premium");
          setCountInfo((prev) => ({ ...prev, isPremium: true }));
        } else if (data.message === "already exist") {
          toast.info("Payment already recorded");
          setCountInfo((prev) => ({ ...prev, isPremium: true }));
        } else {
          toast.error("Payment verification failed");
        }

        // optional: re-fetch user or stats endpoints instead of just toggling local state:
        // const me = await axiosSecure.get("/users/me"); setCountInfo(prev => ({...prev, isPremium: !!me.data.isPremium}));
      } catch (err) {
        console.error("payment-success fetch error:", err);
        toast.error("Payment verification error");
      } finally {
        // remove session_id so effect won't run on reload
        try {
          const u = new URL(window.location.href);
          u.searchParams.delete("session_id");
          window.history.replaceState({}, "", u.toString());
        } catch (e) {}
      }
    })();

    return () => {
      mounted = false;
    };
  }, [axiosSecure]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        // if there's no user, clear state and stop loading
        if (!user) {
          if (mounted) {
            reset({
              name: "",
              phone: "",
              address: "",
              photoURL: "",
            });
            setCountInfo({ count: 0, isPremium: false, limit: 3 });
            setRecentIssues([]);
            setLoading(false);
          }
          return;
        }

        // pre-fill form from firebase user
        reset({
          name: user.displayName || "",
          phone: user.phone || "",
          address: user.address || "",
          photoURL: user.photoURL || "",
        });

        // fetch issue count + premium info
        let countRes;
        try {
          // countRes = await axiosSecure.get("/users/me/issue-count");
        } catch (err) {
          // handle gracefully: show fallback values
          countRes = null;
        }

        if (!mounted) return;

        const countData = countRes?.data ?? {};
        setCountInfo({
          count: countData.count ?? 0,
          isPremium: Boolean(countData.isPremium),
          limit: countData.limit ?? 3,
        });

        // fetch recent issues reported by this user
        const email = user?.email;
        if (email) {
          // server may accept different param names; try createdBy first
          let issuesRes;
          try {
            issuesRes = await axiosSecure.get("/issues", {
              params: { createdBy: email, limit: 5, sort: "createdAt_desc" },
            });
          } catch (err) {
            // fallback to other param name if needed
            try {
              issuesRes = await axiosSecure.get("/issues", {
                params: {
                  reporterEmail: email,
                  limit: 5,
                  sort: "createdAt_desc",
                },
              });
            } catch (err2) {
              issuesRes = null;
            }
          }

          if (!mounted) return;

          // accept either plain array or { data: [...] } shape
          const issuesPayload = issuesRes?.data;
          let issuesArray = [];
          if (Array.isArray(issuesPayload)) {
            issuesArray = issuesPayload;
          } else if (issuesPayload && Array.isArray(issuesPayload.data)) {
            issuesArray = issuesPayload.data;
          } else if (issuesRes && Array.isArray(issuesRes)) {
            issuesArray = issuesRes;
          } else {
            issuesArray = [];
          }

          setRecentIssues(issuesArray);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load profile data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [user, axiosSecure, reset]);

  const onSave = async (formData) => {
    try {
      setSaving(true);
      const payload = {
        name: formData.name?.trim(),
        phone: formData.phone?.trim(),
        address: formData.address?.trim(),
        photoURL: formData.photoURL?.trim(),
      };

      await axiosSecure.post("/users", payload);
      toast.success("Profile saved");

      // refresh counts
      try {
        const countRes = await axiosSecure.get("/users/me/issue-count");
        const countData = countRes?.data ?? {};
        setCountInfo({
          count: countData.count ?? 0,
          isPremium: Boolean(countData.isPremium),
          limit: countData.limit ?? 3,
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error(
        err.response?.data?.error || err.message || "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut?.();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">
            You need to be logged in to see your profile.
          </p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const remaining = countInfo.isPremium
    ? "Unlimited"
    : Math.max(0, countInfo.limit - countInfo.count);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Review Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative group">
            <div className="h-32 bg-brand-slate relative">
               <div className="absolute inset-0 bg-brand-emerald/10"></div>
            </div>
            
            <div className="px-6 pb-8 text-center -mt-12 relative">
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto overflow-hidden bg-slate-100 mb-4">
                  <img src={user.photoURL || "https://i.ibb.co/7CQVJNm/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
               </div>
               
               <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.displayName || "Citizen"}</h2>
               <p className="text-gray-500 text-sm mb-6">{user.email}</p>

               <div className="flex items-center justify-center gap-2 mb-6">
                  {countInfo.isPremium ? (
                    <span className="badge badge-success gap-2 py-3 px-4 text-white font-semibold">
                       <FaCrown /> Premium Member
                    </span>
                  ) : (
                    <span className="badge badge-ghost gap-2 py-3 px-4 text-gray-600 bg-slate-100">
                       Free Plan
                    </span>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div className="text-center">
                     <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reports</p>
                     <p className="text-2xl font-bold text-brand-slate">{countInfo.count}</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                     <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Remaining</p>
                     <p className="text-2xl font-bold text-brand-emerald">{remaining}</p>
                  </div>
               </div>

               {!countInfo.isPremium && (
                 <div className="mt-8">
                    <button 
                       onClick={handleSubscribe} 
                       disabled={subscribing}
                       className="btn btn-primary w-full shadow-lg shadow-primary/20"
                    >
                       <FaCrown className="mr-2" />
                       {subscribing ? "Processing..." : "Upgrade to Premium"}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-3">Unlock unlimited reports & priority support.</p>
                 </div>
               )}

               <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full mt-4 text-error hover:bg-error/10">
                  <FaSignOutAlt className="mr-2" /> Sign Out
               </button>
            </div>
          </div>
        </div>

        {/* Right Content: Edit Form & Activity */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Edit Profile */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
                   <FaUser />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
                   <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
             </div>

             <form onSubmit={handleSubmit(onSave)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="form-control">
                      <label className="label">
                         <span className="label-text font-medium text-gray-700">Full Name</span>
                      </label>
                      <div className="relative">
                         <input 
                           type="text" 
                           className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald" 
                           placeholder="John Doe"
                           {...register("name")}
                        />
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      </div>
                   </div>

                   <div className="form-control">
                      <label className="label">
                         <span className="label-text font-medium text-gray-700">Phone Number</span>
                      </label>
                      <div className="relative">
                         <input 
                           type="tel" 
                           className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald" 
                           placeholder="+880..."
                           {...register("phone")}
                        />
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      </div>
                   </div>
                </div>

                <div className="form-control">
                   <label className="label">
                      <span className="label-text font-medium text-gray-700">Address</span>
                   </label>
                   <div className="relative">
                      <input 
                        type="text" 
                        className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald" 
                        placeholder="123 Street, City"
                        {...register("address")}
                     />
                     <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                   </div>
                </div>

                <div className="form-control">
                   <label className="label">
                      <span className="label-text font-medium text-gray-700">Profile Photo URL</span>
                   </label>
                   <div className="relative">
                      <input 
                        type="url" 
                        className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald" 
                        placeholder="https://..."
                        {...register("photoURL")}
                     />
                     <FaCamera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                   </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        reset({
                          name: user.displayName || "",
                          phone: user.phone || "",
                          address: user.address || "",
                          photoURL: user.photoURL || "",
                        });
                        toast.info("Changes canceled");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn bg-brand-slate text-white hover:bg-slate-700 ${saving ? "loading" : ""}`}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
             </form>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                   <FaHistory />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                   <p className="text-sm text-gray-500">Latest issues you've reported</p>
                </div>
             </div>

             {recentIssues.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <p className="text-gray-500 mb-4">No reports found.</p>
                   <button onClick={() => navigate('/report-issue')} className="btn btn-sm btn-outline">Report your first issue</button>
                </div>
             ) : (
                <div className="space-y-4">
                   {recentIssues.map((issue) => (
                      <div key={issue._id} className="group flex items-center p-4 rounded-xl border border-slate-100 hover:border-brand-emerald/30 hover:shadow-md transition-all bg-white">
                         <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 mr-4">
                            <img 
                              src={(issue.images && issue.images[0]) || "/placeholder.jpg"} 
                              alt="Issue" 
                              className="w-full h-full object-cover" 
                           />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-brand-emerald transition-colors">{issue.title}</h4>
                            <p className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleDateString()} • <span className={`capitalize ${issue.status === 'resolved' ? 'text-green-600' : 'text-amber-600'}`}>{issue.status}</span></p>
                         </div>
                         <button onClick={() => navigate(`/issue-details/${issue._id}`)} className="btn btn-sm btn-ghost opacity-0 group-hover:opacity-100 transition-opacity">
                            View
                         </button>
                      </div>
                   ))}
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}

const ProfileSkeleton = () => {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative h-[500px] animate-pulse">
                <div className="h-32 bg-slate-200 w-full"></div>
                <div className="w-24 h-24 rounded-full bg-slate-300 mx-auto -mt-12 border-4 border-white"></div>
                
                <div className="mt-4 space-y-2 flex flex-col items-center">
                   <div className="h-6 w-32 bg-slate-200 rounded"></div>
                   <div className="h-4 w-40 bg-slate-100 rounded"></div>
                </div>
  
                <div className="mt-6 flex justify-center">
                   <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                </div>
  
                <div className="grid grid-cols-2 gap-4 mt-8 px-6">
                   <div className="h-10 bg-slate-100 rounded"></div>
                   <div className="h-10 bg-slate-100 rounded"></div>
                </div>
             </div>
          </div>
  
          {/* Right Skeleton */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-[400px] animate-pulse">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                   <div className="space-y-2">
                       <div className="h-6 w-40 bg-slate-200 rounded"></div>
                       <div className="h-4 w-60 bg-slate-100 rounded"></div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="h-12 bg-slate-100 rounded-lg"></div>
                   <div className="h-12 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="mt-6 h-12 bg-slate-100 rounded-lg"></div>
                <div className="mt-6 h-12 bg-slate-100 rounded-lg"></div>
             </div>
  
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-[200px] animate-pulse">
               <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                   <div className="h-6 w-32 bg-slate-200 rounded"></div>
               </div>
               <div className="h-20 bg-slate-50 rounded-lg"></div>
             </div>
          </div>
  
        </div>
      </div>
    );
};
