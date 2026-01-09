import React from "react";
import { FaMapMarkerAlt, FaBolt, FaCheckCircle } from "react-icons/fa";

const CityImpactSection = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">Real Impact</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">
             Making Cities <span className="text-primary">Better</span> Together
          </h2>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            Our platform connects citizens, admins, and staff to build safer,
            cleaner, and more responsive cities through real-time issue
            reporting and tracking.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                <FaMapMarkerAlt size={28} />
            </div>
            <span className="text-5xl font-extrabold text-gray-900 tracking-tight">10K+</span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2">
              Issues Reported
            </h3>
            <p className="text-gray-500 mt-2 max-w-xs leading-relaxed">
              Citizens actively report road, lighting, water and cleanliness
              issues daily.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
             <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                <FaBolt size={28} />
            </div>
            <span className="text-5xl font-extrabold text-gray-900 tracking-tight">65%</span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2">
              Faster Response
            </h3>
             <p className="text-gray-500 mt-2 max-w-xs leading-relaxed">
              Streamlined workflows help admin and staff respond more quickly to reports.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
             <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                <FaCheckCircle size={28} />
            </div>
            <span className="text-5xl font-extrabold text-gray-900 tracking-tight">92%</span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2">
              Resolution Rate
            </h3>
             <p className="text-gray-500 mt-2 max-w-xs leading-relaxed">
              Clear timelines and tracking increase issue resolution success significantly.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CityImpactSection;
