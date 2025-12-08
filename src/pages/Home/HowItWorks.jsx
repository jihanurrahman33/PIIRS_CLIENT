import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      label: "Submit Issue",
      title: "1. Citizen Reports a Problem",
      desc: "Citizens submit issues like potholes, broken streetlights, water leakage, or garbage overflow with photo & location.",
    },
    {
      label: "Admin Reviews",
      title: "2. Admin Reviews & Assigns",
      desc: "Admin verifies the issue, assigns it to a staff member, or rejects it with a proper note when needed.",
    },
    {
      label: "Staff Works",
      title: "3. Staff Takes Action",
      desc: "Assigned staff changes status (in-progress, working, resolved) and adds progress updates to the issue timeline.",
    },
    {
      label: "Issue Resolved",
      title: "4. Citizen Tracks & Confirms",
      desc: "Citizens can track status in real-time, see all updates, and get notified when issues are resolved or closed.",
    },
  ];
  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-primary">How It Works</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Our platform connects citizens, admins, and staff in a simple flow
            to make public infrastructure reporting transparent and efficient.
          </p>
        </div>

        {/* Steps Line */}
        <div className="flex justify-center mb-10">
          <ul className="steps steps-vertical lg:steps-horizontal w-full lg:w-auto">
            {steps.map((step, idx) => (
              <li key={idx} className="step step-primary">
                {step.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-300 border border-base-200"
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
