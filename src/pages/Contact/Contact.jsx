import React from "react";
import { MdEmail, MdLocationOn, MdPhone, MdSend } from "react-icons/md";
import { toast } from "react-toastify";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    toast.success("Message sent successfully! We'll allow you to know shortly.");
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-emerald font-bold tracking-wider uppercase text-sm mb-2 block">Support</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We're here to help. Whether you have a question about reporting an issue or need technical support.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Email */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 text-2xl mb-4">
                <MdEmail />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
              <p className="text-gray-500 text-sm mb-4">For general inquiries and support.</p>
              <a href="mailto:support@cityissues.com" className="text-brand-emerald font-semibold hover:underline">
                support@cityissues.com
              </a>
            </div>

            {/* Phone */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-emerald text-2xl mb-4">
                <MdPhone />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Call Us</h3>
              <p className="text-gray-500 text-sm mb-4">Mon-Fri from 9am to 6pm.</p>
              <a href="tel:+8801700000000" className="text-brand-emerald font-semibold hover:underline">
                +880 1700-000000
              </a>
            </div>

            {/* Office */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 text-2xl mb-4">
                <MdLocationOn />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Visit Office</h3>
              <p className="text-gray-500 text-sm mb-4">City Service Center, Smart City Road.</p>
              <span className="text-gray-700 font-medium">Dhaka, Bangladesh</span>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">First Name</span>
                    </label>
                    <input type="text" placeholder="John" className="input input-bordered focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald w-full" required />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Last Name</span>
                    </label>
                    <input type="text" placeholder="Doe" className="input input-bordered focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald w-full" required />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Email Address</span>
                  </label>
                  <input type="email" placeholder="john@example.com" className="input input-bordered focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald w-full" required />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Subject</span>
                  </label>
                  <select className="select select-bordered focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald w-full">
                     <option>General Inquiry</option>
                     <option>Technical Support</option>
                     <option>Feedback</option>
                     <option>Report a Bug</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Message</span>
                  </label>
                  <textarea rows="5" placeholder="How can we help you?" className="textarea textarea-bordered focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald w-full text-base" required></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="btn bg-brand-emerald hover:bg-emerald-600 text-white border-none w-full md:w-auto px-8 h-12 shadow-lg shadow-brand-emerald/20">
                    <MdSend className="mr-2" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
