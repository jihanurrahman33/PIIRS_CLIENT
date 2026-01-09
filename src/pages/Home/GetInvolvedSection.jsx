import React from "react";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";

const GetInvolvedSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 shadow-2xl">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready to transform <br/> your city?
              </h2>
              <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-xl">
                 Join thousands of active citizens. Create a free account to report issues, track progress in real-time, and make a tangible difference in your community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/get-started"
                className="btn btn-lg bg-white text-blue-700 border-none hover:bg-gray-100 hover:scale-105 transition-all shadow-xl font-bold rounded-full px-8 h-14"
              >
                Get Started Free
              </Link>
              <Link
                to="/all-issues"
                className="btn btn-lg btn-outline text-white border-white/30 hover:bg-white/10hover:border-white hover:text-white rounded-full px-8 h-14"
              >
                <span>View Public Issues</span>
                 <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
