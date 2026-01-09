import React from "react";
import { Link } from "react-router";
import { FaCity, FaUsers, FaChartLine, FaHandshake, FaArrowRight } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HERO SECTION */}
      <div className="relative bg-brand-slate text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-slate to-brand-slate/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
           <span className="text-brand-emerald font-bold tracking-widest uppercase text-sm mb-4 block animate-fade-in-up">Who We Are</span>
           <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Building Smarter Cities,<br/>Together.</h1>
           <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We connect citizens with local authorities to solve infrastructure issues faster, transparently, and efficiently.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 pb-20">
        
        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
           {/* Mission Card */}
           <div className="bg-white p-10 rounded-2xl shadow-xl border-t-4 border-brand-emerald">
              <div className="w-14 h-14 bg-brand-emerald/10 rounded-xl flex items-center justify-center mb-6 text-brand-emerald text-2xl">
                 <FaCity />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                 To empower every citizen to be an active participant in their community's well-being. By simplifying the reporting process, we ensure that no pothole goes unseen and no street light stays dark.
              </p>
           </div>

           {/* Vision Card */}
           <div className="bg-white p-10 rounded-2xl shadow-xl border-t-4 border-blue-500">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-500 text-2xl">
                 <FaHandshake />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                 A future where the gap between public needs and administrative action is non-existent. We envision cities that adapt, respond, and thrive through digital collaboration.
              </p>
           </div>
        </div>

         {/* ROLES SECTION */}
         <div className="mb-24">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Designed for Everyone</h2>
               <div className="w-20 h-1 bg-brand-emerald mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {/* Citizen */}
               <div className="group bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-brand-emerald/30 transition-all duration-300">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-emerald group-hover:text-white transition-colors duration-300">
                     <FaUsers className="text-2xl text-slate-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Citizens</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                     Report issues in seconds, track their status in real-time, and see the impact of your contributions on the city map.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-emerald rounded-full"></span> Geo-tagged Reporting</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-emerald rounded-full"></span> Real-time Status Updates</li>
                  </ul>
               </div>

               {/* Staff */}
               <div className="group bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                     <FaCity className="text-2xl text-slate-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Field Staff</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                     Receive direct assignments, update work progress on the go, and close tickets efficiently without paperwork.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Mobile-first Task List</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Direct Status Control</li>
                  </ul>
               </div>

               {/* Admin */}
               <div className="group bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-violet-500/30 transition-all duration-300">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-violet-500 group-hover:text-white transition-colors duration-300">
                     <FaChartLine className="text-2xl text-slate-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Administrators</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                     Gain high-level insights, manage workforce allocation, and identify infrastructure hotspots with data.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span> Analytics Dashboard</li>
                     <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span> Resource Management</li>
                  </ul>
               </div>
            </div>
         </div>

         {/* CTA */}
         <div className="bg-brand-slate rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-emerald/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to make a difference?</h2>
               <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of citizens who are already shaping the future of their neighborhoods.</p>
               <Link to="/get-started" className="btn bg-brand-emerald hover:bg-emerald-600 text-white border-none px-8 h-12 text-lg shadow-lg shadow-brand-emerald/20 group">
                  Get Started Today
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         </div>

      </div>
    </div>
  );
};

export default About;
