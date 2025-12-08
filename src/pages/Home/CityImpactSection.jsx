import React from "react";

const CityImpactSection = () => {
  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Making Cities <span className="text-primary">Better</span> Together
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Our platform connects citizens, admins, and staff to build safer,
            cleaner, and more responsive cities through real-time issue
            reporting and tracking.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-md border">
            <div className="card-body items-center text-center">
              <span className="text-4xl">📍</span>
              <h3 className="text-xl font-semibold mt-2">
                10K+ Issues Reported
              </h3>
              <p className="text-sm text-gray-600">
                Citizens actively report road, lighting, water and cleanliness
                issues.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border">
            <div className="card-body items-center text-center">
              <span className="text-4xl">⚡</span>
              <h3 className="text-xl font-semibold mt-2">
                65% Faster Response
              </h3>
              <p className="text-sm text-gray-600">
                Streamlined workflows help admin and staff respond more quickly.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border">
            <div className="card-body items-center text-center">
              <span className="text-4xl">✅</span>
              <h3 className="text-xl font-semibold mt-2">
                High Resolution Rate
              </h3>
              <p className="text-sm text-gray-600">
                Clear timelines and tracking increase issue resolution success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityImpactSection;
