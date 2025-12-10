import React from "react";
import { Link, Outlet } from "react-router";
import { GoIssueTrackedBy } from "react-icons/go";
import { RiTeamLine } from "react-icons/ri";
import useRole from "../hooks/useRole";
import { MdAssignment } from "react-icons/md";
import { RiFolderWarningLine } from "react-icons/ri";
import { RiCommunityLine } from "react-icons/ri";

const DashBoardLayout = () => {
  const { role } = useRole();

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <nav className="navbar w-full bg-base-300">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              {/* Sidebar toggle icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block size-4"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
            <div className="px-4">Navbar Title</div>
          </nav>
          {/* Page content here */}
          <div className="p-4">
            <Outlet></Outlet>
          </div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Sidebar content here */}
            <ul className="menu w-full grow">
              {/* List item */}
              <li>
                <Link
                  to={"/dashboard"}
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Homepage"
                >
                  {/* Home icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="my-1.5 inline-block size-4"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span className="is-drawer-close:hidden">Homepage</span>
                </Link>
              </li>
              {/* staff role  */}
              {role === "staff" && (
                <li>
                  <Link
                    to={"/dashboard/assigned-issues"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Assigned Issues"
                  >
                    <MdAssignment />
                    <span className="is-drawer-close:hidden">
                      Assigned Issues
                    </span>
                  </Link>
                </li>
              )}

              {/*Admin Route */}
              {role === "admin" && (
                <>
                  <li>
                    <Link
                      to={"/dashboard/manage-staff"}
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Manage Staff"
                    >
                      {/* My Issues icon */}
                      <RiTeamLine />
                      <span className="is-drawer-close:hidden">
                        Manage Staff
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/dashboard/all-issues"}
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="All Issues"
                    >
                      {/* My Issues icon */}
                      <RiFolderWarningLine />
                      <span className="is-drawer-close:hidden">All Issues</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/dashboard/manage-citizens"}
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip="Manage Citizens"
                    >
                      {/* My Issues icon */}
                      <RiCommunityLine />
                      <span className="is-drawer-close:hidden">
                        Manage Citizens
                      </span>
                    </Link>
                  </li>
                </>
              )}

              {/* List item */}
              <li>
                <Link
                  to={"/dashboard/my-issues"}
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="My Issues"
                >
                  {/* My Issues icon */}
                  <GoIssueTrackedBy />
                  <span className="is-drawer-close:hidden">My Issues</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayout;
