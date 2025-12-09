import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Logo from "../Logo/Logo";
import useAuth from "../../hooks/useAuth";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/all-issues">All Issues</Link>
      </li>
      {user && (
        <li>
          <Link to="/report-issue">Report An Issue</Link>
        </li>
      )}
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/contact">Contact Us</Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* LEFT */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Logo />
      </div>

      {/* CENTER */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end space-x-1">
        {user ? (
          <div
            ref={dropdownRef}
            className="relative flex items-center cursor-pointer"
          >
            {/* Avatar */}
            <div onClick={() => setOpen((prev) => !prev)} className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img
                  src={
                    user.photoURL ||
                    "https://i.ibb.co/7CQVJNm/default-avatar.png"
                  }
                  alt={user.displayName || "User avatar"}
                />
              </div>
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-base-100 shadow-xl rounded-xl border border-base-200 z-50">
                {/* Header */}
                <div className="px-4 py-3 border-b border-base-200">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {user.displayName || "Citizen User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Items */}
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span>Profile</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/my-issues"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span>My Issues</span>
                    </Link>
                  </li>
                </ul>

                {/* Footer / Logout */}
                <div className="border-t border-base-200">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-base-200 transition-colors"
                    onClick={() => {
                      logOut().then(() => console.log("logged out"));
                      setOpen(false);
                    }}
                  >
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/get-started" className="btn btn-primary">
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
