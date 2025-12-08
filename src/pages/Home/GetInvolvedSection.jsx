import React from "react";
import { Link } from "react-router";

const GetInvolvedSection = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
          <div className="card-body md:flex md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                Ready to improve your city?
              </h2>
              <p className="text-sm md:text-base opacity-90 max-w-xl">
                Create a free account to start reporting public infrastructure
                issues, track every update in real time, and help authorities
                respond faster. Premium citizens get priority support and
                unlimited issue reports.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Link
                to="/get-started"
                className="btn btn-primary bg-white text-primary hover:bg-base-100 border-none"
              >
                Get Started
              </Link>
              <Link
                to="/all-issues"
                className="btn btn-outline border-base-100 text-primary-content hover:bg-base-100 hover:text-primary"
              >
                View Public Issues
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
