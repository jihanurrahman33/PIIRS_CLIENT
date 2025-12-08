import React from "react";
import { Link } from "react-router";

const Error404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-xl w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="badge badge-error badge-outline text-xs uppercase tracking-widest">
            Error 404
          </div>
        </div>

        <div className="card shadow-xl bg-base-100">
          <div className="card-body items-center">
            <h1 className="text-6xl font-extrabold text-error mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
            <p className="text-base-content/70 mb-6">
              Oops! The page you’re looking for doesn’t exist, was moved, or the
              URL might be wrong.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/" className="btn btn-primary">
                ⬅ Back to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline"
              >
                Go Back
              </button>
            </div>

            <p className="mt-6 text-xs text-base-content/60">
              Need help?{" "}
              <a
                href="mailto:support@example.com"
                className="link link-primary"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
