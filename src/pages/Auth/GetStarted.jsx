import React from "react";
import { Link } from "react-router";
import GetStartedImg from "../../assets/get_started.png";
const GetStarted = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="hero-content flex-col lg:flex-row gap-12">
        {/* --- Left Text Section --- */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Get Started with
            <span className="text-primary"> Public Issue Reporting</span>
          </h1>

          <p className="py-6 text-base text-gray-600">
            Join thousands of citizens helping create cleaner, safer, and
            smarter cities. Report issues, track progress, and stay connected
            with your local authorities.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              to="/register"
              className="btn btn-primary btn-lg w-full sm:w-auto"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="btn btn-outline btn-primary btn-lg w-full sm:w-auto"
            >
              Login
            </Link>
          </div>
        </div>

        {/* --- Right Illustration --- */}
        <div className="w-full max-w-md">
          <img
            src={GetStartedImg}
            alt="Get Started Illustration"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
