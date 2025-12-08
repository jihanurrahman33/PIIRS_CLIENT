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
    icon: <MdReport className="text-5xl text-primary" />,
  },
  {
    title: "Real-time Tracking",
    desc: "Track issue progress from pending to resolved with a clear timeline and status updates.",
    icon: <MdTimeline className="text-5xl text-primary" />,
  },
  {
    title: "Priority Support",
    desc: "Premium users receive faster issue handling and prioritized attention from authorities.",
    icon: <MdPriorityHigh className="text-5xl text-primary" />,
  },
  {
    title: "Assign Issues to Staff",
    desc: "Admins can quickly assign issues to staff for faster resolution and workflow efficiency.",
    icon: <MdEngineering className="text-5xl text-primary" />,
  },
  {
    title: "Boost Issue Priority",
    desc: "Citizens can boost an issue’s priority for urgent handling using a simple payment system.",
    icon: <MdUpgrade className="text-5xl text-primary" />,
  },
  {
    title: "Smart Analytics",
    desc: "Get insights with charts, statistics, and performance reports across the entire system.",
    icon: <MdInsights className="text-5xl text-primary" />,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary">
            Powerful Features for a Smarter City
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Our system makes public infrastructure reporting faster, smarter,
            and more transparent for everyone.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="
                group 
                card bg-base-100
                shadow-md 
                hover:shadow-2xl 
                transition-all 
                duration-300 
                border 
                hover:border-primary 
                cursor-pointer
              "
            >
              <div className="card-body text-center space-y-4">
                <div className="flex justify-center">
                  <div
                    className="
                      p-6 rounded-full bg-primary/10 
                      group-hover:bg-primary/20 
                      transition
                    "
                  >
                    {item.icon}
                  </div>
                </div>

                <h3
                  className="
                    text-xl font-semibold 
                    group-hover:text-primary 
                    transition
                  "
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
