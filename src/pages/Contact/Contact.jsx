import React from "react";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect with backend / email service
    console.log("Contact form submitted");
  };

  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
            Contact Us
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Have a question, feedback, or need help with the Public
            Infrastructure Issue Reporting System? Reach out to us anytime.
          </p>
        </div>

        {/* Info + Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-md border">
              <div className="card-body">
                <h2 className="card-title text-xl mb-3">Get in touch</h2>
                <p className="text-gray-600 text-sm">
                  We work with citizens, staff, and administrators to improve
                  city services. Use the contact form or reach us directly using
                  the details below.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1">
                      <MdEmail className="text-2xl text-primary" />
                    </span>
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <p className="text-gray-600 text-sm">
                        support@cityissuesystem.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-1">
                      <MdPhone className="text-2xl text-primary" />
                    </span>
                    <div>
                      <p className="font-semibold text-sm">Phone</p>
                      <p className="text-gray-600 text-sm">+880 1700-000000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-1">
                      <MdLocationOn className="text-2xl text-primary" />
                    </span>
                    <div>
                      <p className="font-semibold text-sm">Office</p>
                      <p className="text-gray-600 text-sm">
                        City Service Center, Smart City Road, Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Response time: usually within 1–2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="card bg-base-100 shadow-md border">
              <form onSubmit={handleSubmit} className="card-body space-y-4">
                <h2 className="card-title text-xl mb-2">Send us a message</h2>

                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Subject */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Subject</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help you?"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Message */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Message</span>
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Write your message here..."
                    className="textarea textarea-bordered w-full resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit */}
                <div className="form-control pt-2">
                  <button type="submit" className="btn btn-primary w-full">
                    Send Message
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Please do not share sensitive information in this form.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
