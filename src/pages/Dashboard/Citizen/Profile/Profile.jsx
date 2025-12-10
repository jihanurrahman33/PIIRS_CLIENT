// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
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
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="card bg-base-100 shadow border">
            <div className="card-body text-center">
              <div className="avatar mx-auto">
                <div className="w-28 h-28 rounded-full overflow-hidden">
                  <img
                    src={user.photoURL || "/avatar-placeholder.png"}
                    alt={user.displayName || user.email}
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-3">
                {user.displayName || "No name"}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>

              <div className="divider" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subscription</span>
                  <span
                    className={
                      countInfo.isPremium
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {countInfo.isPremium ? "Premium" : "Free"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Issues reported</span>
                  <span className="font-medium">{countInfo.count}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Remaining (free)</span>
                  <span>{remaining}</span>
                </div>
              </div>

              <div className="card-actions justify-center mt-4">
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/dashboard/my-issues")}
                >
                  My Issues
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubscribe}
                  disabled={subscribing || countInfo.isPremium}
                >
                  {subscribing ? "Redirecting..." : "Subscribe"}
                </button>
              </div>

              <div className="mt-4">
                <button className="btn btn-ghost w-full" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="card bg-base-100 shadow border">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>
              <p className="text-sm text-gray-500 mb-4">
                Update your display name, phone number and address. These values
                will be saved to your profile.
              </p>

              <form
                onSubmit={handleSubmit(onSave)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="input input-bordered w-full"
                    {...register("name")}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    className="input input-bordered w-full"
                    {...register("phone")}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Dhaka, Bangladesh"
                    className="input input-bordered w-full"
                    {...register("address")}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text">Photo URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="input input-bordered w-full"
                    {...register("photoURL")}
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className={`btn btn-primary ${saving ? "loading" : ""}`}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>

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
                </div>
              </form>
            </div>
          </div>

          <div className="card bg-base-100 shadow border mt-6">
            <div className="card-body">
              <h4 className="text-lg font-semibold">Recent Issues</h4>
              <p className="text-sm text-gray-500 mb-3">
                Latest issues you reported
              </p>

              {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : recentIssues.length === 0 ? (
                <div className="text-sm text-gray-500">
                  You haven't reported any issues yet.
                </div>
              ) : (
                <ul className="space-y-3">
                  {recentIssues.map((it) => (
                    <li
                      key={it._id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-10 rounded overflow-hidden bg-gray-100">
                          <img
                            src={
                              (it.images && it.images[0]) ||
                              "/placeholder-issue.jpg"
                            }
                            alt={it.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{it.title}</div>
                          <div className="text-xs text-gray-500">
                            {it.status} •{" "}
                            {new Date(it.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => navigate(`/issue-details/${it._id}`)}
                          className="btn btn-sm btn-ghost"
                        >
                          View
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
