import React from "react";
import { Link, Links } from "react-router";
import Logo from "../Logo/Logo";
const NavBar = () => {
  const links = (
    <>
      <li>
        <Link>Home</Link>
      </li>
      <li>
        <Link>All Issues</Link>
      </li>
      <li>
        <Link>About</Link>
      </li>
      <li>
        <Link>Conatct Us</Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
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
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Logo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end space-x-1">
        <Link to={"/get-started"} className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
NavBar;
