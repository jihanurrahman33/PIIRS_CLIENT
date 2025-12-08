import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import GoogleLogin from "./GoogleLogin";

const Register = () => {
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const axiosInstance = useAxios();
  const { registerUser, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setAuthError("");

    const { name, email, password, photoURL } = data;

    try {
      // 1) register the user with Firebase Auth
      const res = await registerUser(email, password);
      const firebaseUser = res.user;

      // 2) update displayName and photoURL (optional but nice)
      await updateUserProfile({ displayName: name, photoURL });

      // 3) get ID token to prove identity to your backend
      const idToken = await firebaseUser.getIdToken(/* forceRefresh = */ true);

      // 4) send allowed profile fields to your backend (backend will verify token)
      const payload = { name, photoURL };
      await axiosInstance.post("/users", payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      // 5) navigate after successful registration + sync
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side text */}
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Create your account
            <span className="text-primary block">Join City Issue Reporter</span>
          </h1>
          <p className="text-base text-gray-600 mb-4">
            Become part of a smarter city. Create an account to report issues,
            follow their progress, and contribute to better public services.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>Report road, light, water, and cleanliness problems</li>
            <li>Get status updates for every issue you submit</li>
            <li>Upgrade to premium for priority handling</li>
          </ul>
        </div>

        {/* Right side card */}
        <div className="card bg-base-100 shadow-xl border">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-body space-y-4"
            noValidate
          >
            <h2 className="card-title justify-center text-2xl mb-2">
              Create an account
            </h2>

            {authError && (
              <div className="alert alert-error py-2 text-sm">
                <span>{authError}</span>
              </div>
            )}

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              {errors.name && (
                <span className="text-xs text-error mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-xs text-error mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Photo URL</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                className={`input input-bordered w-full ${
                  errors.photoURL ? "input-error" : ""
                }`}
                {...register("photoURL", {
                  required: "Photo URL is required",
                  pattern: {
                    value:
                      /^(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/,
                    message: "Please enter a valid URL",
                  },
                })}
              />
              {errors.photoURL && (
                <span className="text-xs text-error mt-1">
                  {errors.photoURL.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  // You can enforce stronger rules if you want:
                  // pattern: {
                  //   value: /^(?=.*[A-Z])(?=.*\d).+$/,
                  //   message: "Must contain at least 1 uppercase & 1 number"
                  // }
                })}
              />
              {errors.password && (
                <span className="text-xs text-error mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-error mt-1">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Terms */}
            <div className="form-control">
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  className={`checkbox checkbox-primary ${
                    errors.terms ? "checkbox-error" : ""
                  }`}
                  {...register("terms", {
                    required: "You must accept the terms & conditions",
                  })}
                />
                <span className="label-text text-sm">
                  I agree to the terms & conditions.
                </span>
              </label>
              {errors.terms && (
                <span className="text-xs text-error mt-1">
                  {errors.terms.message}
                </span>
              )}
            </div>

            {/* Register button */}
            <div className="form-control mt-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
            </div>

            {/* Divider */}
            <div className="divider text-xs">OR CONTINUE WITH</div>
            <GoogleLogin />

            {/* Footer text */}
            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-medium ml-1">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
