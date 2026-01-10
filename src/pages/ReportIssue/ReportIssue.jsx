import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { 
  FaCloudUploadAlt, 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaImage, 
  FaInfoCircle,
  FaRoad,
  FaLightbulb,
  FaTint,
  FaTrash,
  FaWalking,
  FaQuestionCircle,
  FaCheck
} from "react-icons/fa";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const categories = [
  { value: "road", label: "Road / Pothole", icon: FaRoad, color: "text-gray-600 bg-gray-100", activeColor: "bg-gray-600 text-white" },
  { value: "lighting", label: "Streetlight", icon: FaLightbulb, color: "text-amber-600 bg-amber-100", activeColor: "bg-amber-500 text-white" },
  { value: "water", label: "Water Leakage", icon: FaTint, color: "text-blue-600 bg-blue-100", activeColor: "bg-blue-500 text-white" },
  { value: "garbage", label: "Garbage", icon: FaTrash, color: "text-emerald-600 bg-emerald-100", activeColor: "bg-emerald-500 text-white" },
  { value: "sidewalk", label: "Sidewalk", icon: FaWalking, color: "text-purple-600 bg-purple-100", activeColor: "bg-purple-500 text-white" },
  { value: "other", label: "Other", icon: FaQuestionCircle, color: "text-indigo-600 bg-indigo-100", activeColor: "bg-indigo-500 text-white" },
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
    setValue,
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
  const watchedCategory = watch("category");
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

  const [isBlocked, setIsBlocked] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userPostedTotalIssues, setUserPostedTotalIssues] = useState(0);
  const disabled = isSubmitting || isUploading;

  useEffect(() => {
    if (user?.email) {
       axiosSecure.get(`/users/${user.email}/role`).then((res) => {
         setIsBlocked(res.data.isBlcoked);
         setIsPremium(res.data.isPremium);
       });
       axiosSecure
         .get(`/my-issues`)
         .then((res) => setUserPostedTotalIssues(res.data.length));
    }
  }, [user?.email, axiosSecure]);

  if (isBlocked) {
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
            <button
               className="btn btn-outline border-slate-300 text-gray-700 hover:bg-slate-50 hover:border-slate-400 w-full"
               onClick={() => (window.location.href = "/contact")}
            >
               Contact Support
            </button>
        </div>
      </div>
    );
  } 
  
  if (userPostedTotalIssues >= 3 && !isPremium) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 max-w-lg w-full text-center p-8 space-y-6">
            <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Limit Reached</h2>
               <p className="text-gray-500">You've hit the monthly limit of <span className="font-semibold text-gray-900">3 free reports</span>.</p>
            </div>
            <Link to="/dashboard/profile" className="btn bg-brand-emerald hover:bg-emerald-600 text-white border-none w-full shadow-lg shadow-brand-emerald/20">
               Upgrade to Premium
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Report an Issue</h1>
           <p className="text-gray-500 mt-2 text-lg">Spot a problem? Let us know so we can fix it.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* 1. Category Selection */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <label className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 block">1. Select Category</label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                       <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                             setValue("category", cat.value);
                             clearErrors("category");
                          }}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 border ${
                             watchedCategory === cat.value 
                                ? `${cat.activeColor} shadow-md border-transparent transform scale-[1.02]` 
                                : "bg-slate-50 border-slate-100 text-gray-600 hover:bg-slate-100 hover:border-slate-200"
                          }`}
                       >
                          <cat.icon className={`text-2xl mb-2 ${watchedCategory === cat.value ? 'text-white' : cat.color.split(' ')[0]}`} />
                          <span className="text-xs font-semibold">{cat.label}</span>
                          {watchedCategory === cat.value && (
                             <div className="absolute top-2 right-2 bg-white/20 rounded-full p-0.5">
                                <FaCheck className="text-[10px]" />
                             </div>
                          )}
                       </button>
                    ))}
                 </div>
                 <input type="hidden" {...register("category", { required: "Please select a category" })} />
                 {errors.category && <p className="text-xs text-red-500 mt-2 font-medium">{errors.category.message}</p>}
              </div>

              {/* 2. Issue Details */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                 <label className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 block">2. Issue Details</label>
                 
                 <div className="form-control">
                    <label className="label">
                       <span className="label-text font-medium text-gray-700">What's the issue?</span>
                    </label>
                    <input
                       type="text"
                       placeholder="e.g. Deep pothole causing traffic slowdown"
                       className={`input input-bordered w-full h-12 bg-slate-50 focus:bg-white transition-colors ${errors.title ? "input-error" : ""}`}
                       {...register("title", {
                          required: "Title is required",
                          minLength: { value: 8, message: "Must be at least 8 characters" },
                       })}
                       disabled={disabled}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                 </div>

                 <div className="form-control">
                    <label className="label">
                       <span className="label-text font-medium text-gray-700">Where is it located?</span>
                    </label>
                    <div className="relative">
                       <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
                       <input
                          type="text"
                          placeholder="Address, intersection, or landmark"
                          className={`input input-bordered w-full pl-11 h-12 bg-slate-50 focus:bg-white transition-colors ${errors.location ? "input-error" : ""}`}
                          {...register("location", { required: "Location is required" })}
                          disabled={disabled}
                       />
                    </div>
                    {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
                 </div>

                 <div className="form-control">
                    <label className="label">
                       <span className="label-text font-medium text-gray-700">Description</span>
                    </label>
                    <textarea
                       rows={4}
                       placeholder="Provide more details about the problem..."
                       className={`textarea textarea-bordered w-full bg-slate-50 focus:bg-white transition-colors text-base ${errors.description ? "textarea-error" : ""}`}
                       {...register("description", {
                          required: "Description is required",
                          minLength: { value: 20, message: "Please provide at least 20 characters" },
                       })}
                       disabled={disabled}
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                 </div>
              </div>

              {/* 3. Evidence */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <label className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 block">3. Evidence (Optional)</label>
                 
                 <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                    previewUrl ? "border-brand-emerald bg-emerald-50/10" : "border-slate-300 hover:border-brand-emerald hover:bg-slate-50"
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
                       <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
                             <FaCloudUploadAlt className="text-2xl" />
                          </div>
                          <div className="text-center">
                             <p className="text-base font-semibold text-gray-900">Click to upload photo</p>
                             <p className="text-sm text-gray-500 mt-1">or drag and drop here</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Max size: 5MB (JPG, PNG)</p>
                       </label>
                    ) : (
                       <div className="flex flex-col items-center">
                          <div className="relative w-full max-w-sm overflow-hidden rounded-lg shadow-lg">
                             <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover" />
                             <button
                                type="button"
                                onClick={() => {
                                   setValue("image", null);
                                   setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 btn btn-circle btn-sm btn-error text-white shadow-md"
                             >
                                ✕
                             </button>
                          </div>
                          <p className="text-sm text-emerald-600 font-medium mt-4 flex items-center gap-2">
                             <FaCheck /> Image selected successfully
                          </p>
                       </div>
                    )}
                 </div>
                 {errors.image && <p className="text-xs text-red-500 mt-2 text-center">{errors.image.message}</p>}
              </div>

              <div className="pt-2">
                 <button
                    type="submit"
                    className={`btn btn-primary w-full h-14 text-lg font-bold shadow-xl shadow-brand-emerald/20 normal-case ${disabled ? 'opacity-70' : ''}`}
                    disabled={disabled}
                 >
                    {isUploading ? (
                       <>
                          <span className="loading loading-spinner"></span> Uploading Evidence...
                       </>
                    ) : isSubmitting ? (
                       <>
                          <span className="loading loading-spinner"></span> Submitting Report...
                       </>
                    ) : (
                       "Submit Report"
                    )}
                 </button>
              </div>

            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-28">
               <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                     <FaInfoCircle />
                  </div>
                  <h3 className="font-bold text-gray-900">Posting Guidelines</h3>
               </div>
               
               <ul className="space-y-4">
                  {[
                     { title: "Be Specific", desc: "Detailed titles help us categorize faster." },
                     { title: "Precise Location", desc: "Use landmarks or cross-streets." },
                     { title: "Clear Photos", desc: "Photos speed up verification by 50%." }
                  ].map((item, idx) => (
                     <li key={idx} className="flex gap-3 text-sm">
                        <span className="font-bold text-gray-300 font-mono text-lg select-none">0{idx + 1}</span>
                        <div>
                           <strong className="text-gray-900 block">{item.title}</strong>
                           <span className="text-gray-500">{item.desc}</span>
                        </div>
                     </li>
                  ))}
               </ul>

               <div className="divider my-6"></div>

               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-gray-400 uppercase">Monthly Limit</span>
                     <span className={`text-sm font-bold ${isPremium ? 'text-brand-emerald' : 'text-amber-500'}`}>
                        {isPremium ? "Unlimited" : "3 Reports"}
                     </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                     <div 
                        className={`h-2 rounded-full ${isPremium ? 'bg-brand-emerald' : 'bg-amber-500'}`} 
                        style={{ width: isPremium ? '100%' : `${Math.min((userPostedTotalIssues / 3) * 100, 100)}%` }}
                     ></div>
                  </div>
                  {!isPremium && (
                     <p className="text-xs text-gray-500 mt-2">Upgrade for unlimited reports and priority support.</p>
                  )}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
