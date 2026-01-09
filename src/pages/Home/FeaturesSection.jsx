import React from "react";
import {
  MdReport,
  MdTimeline,
  MdPriorityHigh,
  MdEngineering,
  MdUpgrade,
  MdInsights,
} from "react-icons/md";

const features = [
  {
    title: "Report Issues Easily",
    desc: "Submit problems like potholes, broken streetlights, or garbage overflow within seconds.",
    icon: <MdReport size={32} />,
  },
  {
    title: "Real-time Tracking",
    desc: "Track issue progress from pending to resolved with a clear timeline and status updates.",
    icon: <MdTimeline size={32} />,
  },
  {
    title: "Priority Support",
    desc: "Premium users receive faster issue handling and prioritized attention from authorities.",
    icon: <MdPriorityHigh size={32} />,
  },
  {
    title: "Assign Issues to Staff",
    desc: "Admins can quickly assign issues to staff for faster resolution and workflow efficiency.",
    icon: <MdEngineering size={32} />,
  },
  {
    title: "Boost Issue Priority",
    desc: "Citizens can boost an issue’s priority for urgent handling using a simple payment system.",
    icon: <MdUpgrade size={32} />,
  },
  {
    title: "Smart Analytics",
    desc: "Get insights with charts, statistics, and performance reports across the entire system.",
    icon: <MdInsights size={32} />,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">Key Features</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Powerful Features for a Smarter City
          </h2>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            Our system makes public infrastructure reporting faster, smarter,
            and more transparent for everyone involved.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="
                group
                bg-white rounded-2xl p-8
                border border-gray-100
                shadow-sm hover:shadow-xl
                transition-all duration-300
                flex flex-col items-start
              "
            >
              <div
                className="
                  mb-6 p-4 rounded-xl 
                  bg-blue-50 text-primary
                  group-hover:bg-primary group-hover:text-white
                  transition-colors duration-300
                "
              >
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
