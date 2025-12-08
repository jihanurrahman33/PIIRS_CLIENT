import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";

const Register = () => {
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
      // TODO: Replace with your real registration logic (Firebase / API)
      // Example:
      // const userCredential = await createUser(email, password);
      // await updateUserProfile({ displayName: name, photoURL });
      // await saveUserToDb({ name, email, photoURL, role: 'citizen' });

      console.log("Register with:", { name, email, password, photoURL });

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setAuthError("Registration failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setAuthError("");
      // TODO: replace with your Google sign-up logic
      // await signUpWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setAuthError("Google sign-up failed. Please try again.");
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

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="btn bg-white text-black border-[#e5e5e5] w-full"
              disabled={isSubmitting}
            >
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Sign up with Google
            </button>

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
