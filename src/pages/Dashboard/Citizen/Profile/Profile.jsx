// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

/**
 * Profile page
 *
 * - Shows profile card (avatar, name, email, subscription status)
 * - Lets user edit safe fields (name, phone, address, photoURL)
 * - Fetches user's issue count and recent issues (for summary)
 * - Uses axiosSecure (attaches ID token) to call your backend endpoints:
 *    GET  /users/me/issue-count       -> { count, isPremium, limit }
 *    GET  /issues?reporterEmail=...   -> recent issues list (optional)
 *    POST /users                      -> upsert profile (server verifies token)
 */
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

  const [loading, setLoading] = useState(true);
  const [countInfo, setCountInfo] = useState({
    count: 0,
    isPremium: false,
    limit: 3,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load profile info into form and fetch counts + recent issues
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (!user) return;
        // pre-fill form from firebase user + server if desired
        reset({
          name: user.displayName || "",
          phone: user.phone || "",
          address: user.address || "",
          photoURL: user.photoURL || "",
        });

        // fetch issue count + premium info
        const countRes = await axiosSecure.get("/users/me/issue-count");
        if (!mounted) return;
        setCountInfo({
          count: countRes.data.count ?? 0,
          isPremium: !!countRes.data.isPremium,
          limit: countRes.data.limit ?? 3,
        });

        // fetch recent issues reported by this user (backend should support filter)
        // we use email as reporter id because your sample used createdBy as email
        const email = user?.email;
        if (email) {
          const issuesRes = await axiosSecure.get("/issues", {
            params: { reporterEmail: email, limit: 5, sort: "-createdAt" },
          });
          setRecentIssues(issuesRes.data || []);
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

  // Save profile handler -> sends allowed fields to backend which verifies token
  const onSave = async (formData) => {
    try {
      setSaving(true);
      // whitelist only safe fields
      const payload = {
        name: formData.name?.trim(),
        phone: formData.phone?.trim(),
        address: formData.address?.trim(),
        photoURL: formData.photoURL?.trim(),
      };

      // backend verifies token via axiosSecure interceptor / middleware
      const res = await axiosSecure.post("/users", payload);
      // depending on backend, you might receive updated user object
      toast.success("Profile saved");
      // optionally update local UI / re-fetch counters
      const countRes = await axiosSecure.get("/users/me/issue-count");
      setCountInfo({
        count: countRes.data.count ?? 0,
        isPremium: !!countRes.data.isPremium,
        limit: countRes.data.limit ?? 3,
      });
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
      await logOut?.(); // if your hook uses signOut or logOut
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

  // Quick UI pieces
  const remaining = countInfo.isPremium
    ? "Unlimited"
    : Math.max(0, countInfo.limit - countInfo.count);

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Profile card */}
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
                  onClick={() => navigate("/dashboard/citizen/my-issues")}
                >
                  My Issues
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/dashboard/profile/subscribe")}
                >
                  Subscribe
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

        {/* MIDDLE: Edit profile */}
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
                      // reset form to current firebase values (quick cancel)
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

          {/* Recent issues */}
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
                          onClick={() => navigate(`/issues/${it._id}`)}
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
