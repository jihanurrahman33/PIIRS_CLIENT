import React from "react";
import { Link } from "react-router";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Submit a Report",
      desc: "Identify an infrastructure issue like a pothole or streetlight outage. Snap a photo, add location details, and submit it instantly.",
    },
    {
      step: "02",
      title: "Admin Review",
      desc: "Our admins verify the report to ensure accuracy. Once approved, it's assigned to the appropriate department or staff member.",
    },
    {
      step: "03",
      title: "Action Taken",
      desc: "Dedicated staff members work on the issue. You can track progress in real-time as the status moves from 'In Progress' to 'Resolved'.",
    },
    {
      step: "04",
      title: "Issue Resolved",
      desc: "The issue is fixed! You receive a notification confirming the resolution. Together, we make our city safer and cleaner.",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            From reporting an issue to seeing it fixed, our transparent process keeps you informed every step of the way.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[2.25rem] left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-10">
            {steps.map((item, idx) => (
              <div key={idx} className="relative group">
                
                {/* Step Indicator */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 z-20">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-50 flex items-center justify-center group-hover:border-primary/20 transition-colors duration-300 shadow-sm">
                    <span className="text-xl font-bold text-primary">{item.step}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-slate-50 rounded-2xl p-8 pt-12 border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 h-full relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors text-center lg:text-left">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed text-center lg:text-left">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center relative z-30">
          <Link
            to="/report-issue"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-full shadow-lg hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Start Reporting Now
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
