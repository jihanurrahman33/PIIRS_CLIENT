import React from "react";
import { MdPublic, MdSecurity, MdTrackChanges, MdPeople } from "react-icons/md";
import { Link } from "react-router";

const About = () => {
  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
            About Our Platform
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We built the Public Infrastructure Issue Reporting System to connect
            citizens, staff, and administrators in a single platform that makes
            cities smarter, cleaner, and safer.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="card bg-base-100 shadow-md p-8 border">
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to empower communities by giving citizens a simple
              way to report public issues and track progress transparently. We
              aim to make municipalities more responsive and infrastructure more
              reliable.
            </p>
          </div>

          <div className="card bg-base-100 shadow-md p-8 border">
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where technology bridges the gap between
              citizens and authorities — resulting in safer streets, cleaner
              neighborhoods, and a more connected society.
            </p>
          </div>
        </div>

        {/* WHY THIS PLATFORM MATTERS */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary">
            Why This Platform Matters
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Public infrastructure issues often go unresolved due to delayed
            communication and lack of visibility. Our system ensures faster
            reporting, better tracking, and improved city services.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="card bg-base-100 shadow-md border p-6 hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center space-y-3">
              <MdPublic className="text-4xl text-primary" />
              <h3 className="text-lg font-semibold">Citizen-Friendly</h3>
              <p className="text-gray-600 text-sm">
                Anyone can report problems easily with photos and location.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border p-6 hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center space-y-3">
              <MdTrackChanges className="text-4xl text-primary" />
              <h3 className="text-lg font-semibold">Transparent Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track real-time progress from pending to resolved.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border p-6 hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center space-y-3">
              <MdSecurity className="text-4xl text-primary" />
              <h3 className="text-lg font-semibold">Secure & Reliable</h3>
              <p className="text-gray-600 text-sm">
                Safe login, protected data, and verified user roles.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border p-6 hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center space-y-3">
              <MdPeople className="text-4xl text-primary" />
              <h3 className="text-lg font-semibold">Built for Everyone</h3>
              <p className="text-gray-600 text-sm">
                Designed for citizens, admins, staff, and city authorities.
              </p>
            </div>
          </div>
        </div>

        {/* ROLES SECTION */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary">
            Designed for Every Role
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Each role gets the right tools they need to make public service
            efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card bg-base-100 shadow-md border p-6">
            <h3 className="text-xl font-bold mb-2 text-primary">Citizens</h3>
            <p className="text-gray-600 text-sm">
              Report issues, track progress, boost priority, and stay updated
              with timeline changes.
            </p>
          </div>

          <div className="card bg-base-100 shadow-md border p-6">
            <h3 className="text-xl font-bold mb-2 text-primary">Staff</h3>
            <p className="text-gray-600 text-sm">
              Get assigned tasks, update work status, and resolve issues
              efficiently.
            </p>
          </div>

          <div className="card bg-base-100 shadow-md border p-6">
            <h3 className="text-xl font-bold mb-2 text-primary">Admins</h3>
            <p className="text-gray-600 text-sm">
              Manage users, assign staff, oversee issues, track payments, and
              maintain full system control.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <Link
            to="/get-started"
            className="btn btn-primary btn-lg shadow-lg px-8"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
