import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signInGoogle, signInUser } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setAuthError("");
    const { email, password } = data;

    try {
      // TODO: replace with your actual login logic (Firebase / API)
      // await signInUser(email, password);
      console.log("Login with:", email, password);
      signInUser().then((res) => {
        if (res.user.accessToken) {
          navigate(from, { replace: true });
        }
      });
    } catch (err) {
      console.error(err);
      setAuthError("Invalid email or password. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError("");
      signInGoogle().then((res) => {
        if (res.user.accessToken) {
          navigate(from, { replace: true });
        }
      });
    } catch (err) {
      console.error(err);
      setAuthError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side text */}
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome back to
            <span className="text-primary block">City Issue Reporter</span>
          </h1>
          <p className="text-base text-gray-600 mb-4">
            Login to report new issues, track your existing reports, and see how
            your city is improving day by day.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>Submit public infrastructure issues in seconds</li>
            <li>Track status from pending to resolved</li>
            <li>Get priority support as a premium citizen</li>
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
              Login to your account
            </h2>

            {authError && (
              <div className="alert alert-error py-2 text-sm">
                <span>{authError}</span>
              </div>
            )}

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
                })}
              />
              {errors.password && (
                <span className="text-xs text-error mt-1">
                  {errors.password.message}
                </span>
              )}

              <label className="label justify-end">
                <button
                  type="button"
                  className="label-text-alt link link-hover"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot password?
                </button>
              </label>
            </div>

            {/* Login button */}
            <div className="form-control mt-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Divider */}
            <div className="divider text-xs">OR CONTINUE WITH</div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
              Login with Google
            </button>

            {/* Footer text */}
            <p className="text-center text-sm mt-2">
              Don&rsquo;t have an account?{" "}
              <Link
                to="/register"
                className="link link-primary font-medium ml-1"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
