import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
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

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-600 hover:bg-base-200 hover:text-gray-900"
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-issues" className={navLinkClass}>
          All Issues
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/report-issue" className={navLinkClass}>
            Report Issue
          </NavLink>
        </li>
      )}
      <li>
        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={navLinkClass}>
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-lg bg-base-100/90 border-b border-base-200">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              {links}
            </ul>
          </div>
          <Logo />
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">{links}</ul>
        </div>

        {/* RIGHT */}
        <div className="navbar-end space-x-2">
          {user ? (
            <div
              ref={dropdownRef}
              className="relative flex items-center cursor-pointer"
            >
              {/* Avatar */}
              <div onClick={() => setOpen((prev) => !prev)} className="avatar placeholder">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden cursor-pointer transition-transform hover:scale-105">
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
                <div className="absolute right-0 top-full mt-3 w-64 bg-base-100 shadow-xl rounded-xl border border-base-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-base-200 bg-base-50/50 rounded-t-xl">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.displayName || "Citizen User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Items */}
                  <ul className="p-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-primary/5 hover:text-primary transition-all"
                        onClick={() => setOpen(false)}
                      >
                        <i className="fa-solid fa-user text-xs"></i>
                        <span>Profile</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-primary/5 hover:text-primary transition-all"
                        onClick={() => setOpen(false)}
                      >
                         <i className="fa-solid fa-chart-line text-xs"></i>
                        <span>Dashboard</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/dashboard/my-issues"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-primary/5 hover:text-primary transition-all"
                        onClick={() => setOpen(false)}
                      >
                        <i className="fa-solid fa-list-check text-xs"></i>
                        <span>My Issues</span>
                      </Link>
                    </li>
                  </ul>

                  {/* Footer / Logout */}
                  <div className="p-2 border-t border-base-200">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-error bg-error/5 hover:bg-error/10 rounded-lg transition-colors"
                      onClick={() => {
                        logOut().then(() => console.log("logged out"));
                        setOpen(false);
                      }}
                    >
                      <span>Sign details out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
               {/* Optional: Add Login button if you have a separate login page distinct from Get Started */}
              <Link to="/get-started" className="btn btn-primary btn-sm px-5 font-normal">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;

