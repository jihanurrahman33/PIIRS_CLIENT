import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaExclamationTriangle, FaMapMarkerAlt, FaImage, FaInfoCircle } from "react-icons/fa";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const categories = [
  { value: "road", label: "Road / Pothole" },
  { value: "lighting", label: "Streetlight" },
  { value: "water", label: "Water Leakage" },
  { value: "garbage", label: "Garbage / Cleanliness" },
  { value: "sidewalk", label: "Footpath / Sidewalk" },
  { value: "other", label: "Other" },
];

export default function ReportIssue() {
  const { user } = useAuth() ?? {};
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      image: null,
    },
  });

  const watchedImage = watch("image");

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const file = watchedImage?.[0] ?? null;
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("image", {
        type: "manual",
        message: "Only JPG, PNG or WEBP images allowed.",
      });
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("image", {
        type: "manual",
        message: "Image too large. Max 5MB allowed.",
      });
      setPreviewUrl(null);
      return;
    }

    clearErrors("image");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [watchedImage, setError, clearErrors]);

  async function uploadToImgBB(file) {
    if (!file) return null;
    const apiKey = import.meta.env.VITE_IMGBB_KEY;
    if (!apiKey) throw new Error("ImgBB API key not configured.");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) {
      console.error("imgbb response:", data);
      throw new Error(data?.error?.message || "Image upload failed");
    }

    return data.data.url;
  }

  const onSubmit = async (formData) => {
    try {
      if (!user) {
        toast.error("You must be logged in to report an issue.");
        return;
      }

      setIsUploading(true);

      const { title, description, category, location } = formData;

      let imageUrls = [];
      const file = formData.image?.[0] ?? null;
      if (file) {
        toast.info("Uploading image...");
        const url = await uploadToImgBB(file);
        imageUrls.push(url);
        toast.success("Image uploaded.");
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        images: imageUrls,
      };

      const res = await axiosSecure.post("/issues", payload);

      if (res?.data) {
        toast.success("Issue submitted successfully.");
        reset();
        setPreviewUrl(null);
        navigate("/");
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      const msg =
        err.response?.data?.error || err.message || "Failed to submit issue.";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };
  const [isBlcoked, setIsBlcoked] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userPostedTotalIssues, setuserPostedTotalIssues] = useState(0);
  const disabled = isSubmitting || isUploading;
  useEffect(() => {
    axiosSecure.get(`/users/${user?.email}/role`).then((res) => {
      setIsBlcoked(res.data.isBlcoked);
      setIsPremium(res.data.isPremium);
    });
    axiosSecure
      .get(`/my-issues`)
      .then((res) => setuserPostedTotalIssues(res.data.length));
  }, [user?.email, axiosSecure]);
  
  const selectedFile = useMemo(() => watchedImage?.[0] ?? null, [watchedImage]);

  if (isBlcoked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 max-w-lg w-full text-center p-8 space-y-6">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <FaExclamationTriangle className="text-red-500 text-3xl" />
            </div>

            <div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h2>
               <p className="text-gray-500">Your account has been restricted specific actions. This usually happens due to policy violations.</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-sm text-left">
               <p className="font-semibold text-gray-700 mb-1">What this means:</p>
               <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>You cannot submit new reports.</li>
                  <li>You cannot comment or upvote.</li>
                  <li>Previous reports remain visible.</li>
               </ul>
            </div>

            <button
               className="btn btn-outline border-slate-300 text-gray-700 hover:bg-slate-50 hover:border-slate-400 w-full"
               onClick={() => (window.location.href = "/contact")}
            >
               Contact Support
            </button>
        </div>
      </div>
    );
  } else if (userPostedTotalIssues >= 3 && !isPremium) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 max-w-lg w-full text-center p-8 space-y-6">
            <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>

            <div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Required</h2>
               <p className="text-gray-500">You've hit the monthly limit of <span className="font-semibold text-gray-900">3 free reports</span>.</p>
            </div>

            <div className="bg-gradient-to-br from-brand-emerald/10 to-teal-50 rounded-xl p-5 border border-brand-emerald/20 text-left">
               <h4 className="font-bold text-brand-emerald mb-2">Upgrade to Premium</h4>
               <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><span className="text-brand-emerald">✓</span> Unlimited Submissions</li>
                  <li className="flex items-center gap-2"><span className="text-brand-emerald">✓</span> Priority Review Status</li>
                  <li className="flex items-center gap-2"><span className="text-brand-emerald">✓</span> Direct Staff Communication</li>
               </ul>
            </div>

            <Link to="/dashboard/profile" className="btn bg-brand-emerald hover:bg-emerald-600 text-white border-none w-full shadow-lg shadow-brand-emerald/20">
               Upgrade Plan
            </Link>

            <p className="text-xs text-slate-400">Cancel anytime. Secure payment.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-8 text-center sm:text-left">
             <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
             <p className="text-gray-500 mt-2">Help us improve your neighborhood by reporting infrastructure problems.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8">
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Issue Title</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Deep Pothole on Main St."
                        className={`input input-bordered w-full focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald ${
                          errors.title ? "input-error" : ""
                        }`}
                        {...register("title", {
                          required: "Title is required",
                          minLength: {
                            value: 8,
                            message: "Must be at least 8 characters",
                          },
                        })}
                        disabled={disabled}
                      />
                      {errors.title && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Location */}
                      <div className="form-control">
                        <label className="label">
                           <span className="label-text font-semibold text-gray-700">Location</span>
                        </label>
                        <div className="relative">
                           <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                           <input
                              type="text"
                              placeholder="Address or Landmark"
                              className={`input input-bordered w-full pl-10 focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald ${
                              errors.location ? "input-error" : ""
                              }`}
                              {...register("location", { required: "Location is required" })}
                              disabled={disabled}
                           />
                        </div>
                        {errors.location && (
                           <p className="text-xs text-red-500 mt-1 ml-1">{errors.location.message}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div className="form-control">
                        <label className="label">
                           <span className="label-text font-semibold text-gray-700">Category</span>
                        </label>
                        <select
                           className={`select select-bordered w-full focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald ${
                           errors.category ? "select-error" : ""
                           }`}
                           {...register("category", { required: "Select a category" })}
                           disabled={disabled}
                           defaultValue=""
                        >
                           <option value="" disabled>Select Type</option>
                           {categories.map((c) => (
                           <option key={c.value} value={c.value}>{c.label}</option>
                           ))}
                        </select>
                        {errors.category && (
                           <p className="text-xs text-red-500 mt-1 ml-1">{errors.category.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Description</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Please describe the issue in detail. Mention any safety hazards."
                        className={`textarea textarea-bordered w-full focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald ${
                          errors.description ? "textarea-error" : ""
                        }`}
                        {...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 20,
                            message: "Please provide at least 20 characters detail",
                          },
                        })}
                        disabled={disabled}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Image Upload - Drag Area Style */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Proof Image <span className="text-gray-400 font-normal">(Optional)</span></span>
                      </label>
                      
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                         errors.image ? "border-red-300 bg-red-50" : "border-slate-300 hover:border-brand-emerald hover:bg-slate-50"
                      }`}>
                         <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            className="hidden"
                            {...register("image")}
                            disabled={disabled}
                         />
                         
                         {!previewUrl ? (
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                  <FaCloudUploadAlt className="text-2xl" />
                               </div>
                               <p className="text-sm font-medium text-gray-700">Click to upload photo</p>
                               <p className="text-xs text-gray-400">SVG, PNG, JPG or WEBP (MAX. 5MB)</p>
                            </label>
                         ) : (
                            <div className="relative inline-block">
                               <img src={previewUrl} alt="Preview" className="h-48 rounded-lg object-cover shadow-sm border border-slate-200" />
                               <label htmlFor="image-upload" className="absolute -bottom-3 -right-3 btn btn-sm btn-circle btn-neutral shadow-lg">
                                  <FaImage className="text-white text-xs" />
                               </label>
                            </div>
                         )}
                      </div>
                      
                      {errors.image && (
                         <p className="text-xs text-red-500 mt-2 text-center">{errors.image.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className={`btn bg-brand-emerald hover:bg-emerald-600 text-white border-none w-full text-lg normal-case h-12 shadow-lg shadow-emerald-200 ${
                          disabled ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        disabled={disabled}
                      >
                        {isUploading ? (
                           <>
                              <span className="loading loading-spinner"></span>
                              Uploading Image...
                           </>
                        ) : isSubmitting ? (
                           <>
                              <span className="loading loading-spinner"></span>
                              Submitting Report...
                           </>
                        ) : (
                           "Submit Report"
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT: Guidelines Sidebar */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-28">
                <div className="flex items-center gap-2 mb-4 text-brand-slate">
                   <FaInfoCircle className="text-xl" />
                   <h3 className="font-bold text-lg">Posting Guidelines</h3>
                </div>
                
                <ul className="space-y-4 text-sm text-gray-600">
                   <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">1</span>
                      <span><strong className="text-gray-800">Be Specific:</strong> "Broken street light" is better than "It's dark".</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">2</span>
                      <span><strong className="text-gray-800">Pinpoint Location:</strong> Use landmarks or exact cross-streets.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">3</span>
                      <span><strong className="text-gray-800">Photos Help:</strong> A clear photo speeds up the verification process significantly.</span>
                   </li>
                </ul>

                <div className="divider my-6"></div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account Limits</p>
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Daily Uploads</span>
                      <span className="text-sm font-bold text-brand-emerald">{isPremium ? "Unlimited" : "3 Left"}</span>
                   </div>
                   {!isPremium && (
                      <Link to="/dashboard/profile" className="text-xs text-brand-emerald hover:underline mt-2 inline-block">
                         Remove limits &rarr;
                      </Link>
                   )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
