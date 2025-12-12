import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

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
  const [userPostedTotalIssues, setuserPostedTotalIssues] = useState(0);
  const disabled = isSubmitting || isUploading;
  useEffect(() => {
    axiosSecure
      .get(`/users/${user?.email}/role`)
      .then((res) => setIsBlcoked(res.data.isBlcoked));
    axiosSecure
      .get(`/my-issues`)
      .then((res) => setuserPostedTotalIssues(res.data.length));
  }, [user?.email, axiosSecure]);
  const selectedFile = useMemo(() => watchedImage?.[0] ?? null, [watchedImage]);
  if (isBlcoked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl border max-w-lg w-full">
          <div className="card-body items-center text-center space-y-4">
            <div className="text-red-600 text-6xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
                1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 
                18c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-red-600">
              Your Account is Blocked
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed">
              You are currently restricted from reporting, editing, or upvoting
              issues.
              <br />
              This action was taken due to violation of our usage policy or
              suspicious activity.
            </p>

            <p className="text-gray-500 text-xs italic">
              If you believe this is a mistake, please contact authorities or
              our support team.
            </p>

            <div className="card-actions mt-4">
              <button
                className="btn btn-outline btn-error"
                onClick={() => (window.location.href = "/contact")}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (userPostedTotalIssues >= 3) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl border max-w-xl w-full">
          <div className="card-body text-center space-y-4">
            {/* Icon */}
            <div className="text-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mx-auto text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 8v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 
                1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 
                1.33.19 3 1.73 3z"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-yellow-600">
              Issue Submission Limit Reached
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed">
              You have reached your free limit of{" "}
              <span className="font-semibold">3 issues</span>.
              <br />
              Upgrade to a premium subscription to submit unlimited issues and
              receive priority support.
            </p>

            {/* Features */}
            <div className="text-sm text-gray-500 mt-2">
              <ul className="space-y-1">
                <li>✔ Unlimited Issue Submissions</li>
                <li>✔ Priority Issue Review</li>
                <li>✔ Faster Response from Staff</li>
              </ul>
            </div>

            {/* Subscribe Button */}
            <div className="card-actions justify-center mt-4">
              <Link to="/dashboard/profile" className="btn btn-primary w-40">
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-base-200 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT: Form */}
            <div className="md:col-span-2">
              <div className="card bg-base-100 shadow-lg border">
                <div className="card-body">
                  <h1 className="text-2xl font-semibold mb-1">
                    Report an Issue
                  </h1>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide a clear title, description, category and an optional
                    photo so staff can locate and fix the issue quickly.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Title</span>
                      </label>
                      <input
                        type="text"
                        placeholder="E.g. Broken streetlight near Central Park"
                        className={`input input-bordered w-full ${
                          errors.title ? "input-error" : ""
                        }`}
                        {...register("title", {
                          required: "Please enter a title",
                          minLength: {
                            value: 8,
                            message: "Title must be at least 8 characters",
                          },
                        })}
                        disabled={disabled}
                      />
                      {errors.title && (
                        <p className="text-xs text-error mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Description
                        </span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Describe the issue in detail — what, where, how long, safety concerns..."
                        className={`textarea textarea-bordered w-full ${
                          errors.description ? "textarea-error" : ""
                        }`}
                        {...register("description", {
                          required: "Please enter a description",
                          minLength: {
                            value: 20,
                            message: "Please add more details (20+ characters)",
                          },
                        })}
                        disabled={disabled}
                      />
                      {errors.description && (
                        <p className="text-xs text-error mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category */}
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">
                            Category
                          </span>
                        </label>
                        <select
                          className={`select select-bordered w-full ${
                            errors.category ? "select-error" : ""
                          }`}
                          {...register("category", {
                            required: "Please select a category",
                          })}
                          disabled={disabled}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Choose category
                          </option>
                          {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="text-xs text-error mt-1">
                            {errors.category.message}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="label">
                          <span className="label-text font-medium">
                            Location
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Address or short location (e.g. Road 12, Mirpur, Dhaka)"
                          className={`input input-bordered w-full ${
                            errors.location ? "input-error" : ""
                          }`}
                          {...register("location", {
                            required: "Please provide a location",
                          })}
                          disabled={disabled}
                        />
                        {errors.location && (
                          <p className="text-xs text-error mt-1">
                            {errors.location.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Image upload */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Upload Image (optional)
                        </span>
                      </label>

                      <div className="flex items-center gap-3">
                        <label className="btn btn-outline btn-sm cursor-pointer">
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image")}
                            disabled={disabled}
                          />
                        </label>

                        <div className="text-sm text-gray-600">
                          {selectedFile ? (
                            <div>
                              <div className="font-medium">
                                {selectedFile.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB • {selectedFile.type}
                              </div>
                            </div>
                          ) : (
                            <div>No image selected</div>
                          )}
                        </div>
                      </div>

                      {errors.image && (
                        <p className="text-xs text-error mt-2">
                          {errors.image.message}
                        </p>
                      )}

                      {previewUrl && (
                        <div className="mt-3">
                          <div className="rounded-md overflow-hidden border w-56 h-36">
                            <img
                              src={previewUrl}
                              alt="preview"
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Preview — image will be uploaded to ImgBB when you
                            submit.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className={`btn btn-primary w-full ${
                          disabled ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        disabled={disabled}
                      >
                        {isUploading
                          ? "Uploading..."
                          : isSubmitting
                          ? "Submitting..."
                          : "Report Issue"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT: Tips card */}
            <div>
              <div className="card bg-base-100 shadow border p-4 sticky top-24">
                <h3 className="font-semibold mb-2">Tips for good reports</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  <li>
                    Write a clear title that explains the problem briefly.
                  </li>
                  <li>
                    Include exact location (landmark, road number) to help staff
                    find it faster.
                  </li>
                  <li>
                    Attach a recent photo showing the problem (if available).
                  </li>
                  <li>
                    Small, clear photos are better than huge, blurry ones.
                  </li>
                  <li>
                    If the issue is urgent (safety), mark it in the description.
                  </li>
                </ul>

                <div className="divider" />

                <div className="text-sm">
                  <p className="font-medium">Image limits</p>
                  <p className="text-gray-600">
                    Max: 5MB. Allowed: JPG, PNG, WEBP. Images uploaded to ImgBB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* small footer note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Note: Free users can report up to 3 issues. If you reach the limit,
            upgrade to premium in your profile.
          </p>
        </div>
      </div>
    );
  }
}
