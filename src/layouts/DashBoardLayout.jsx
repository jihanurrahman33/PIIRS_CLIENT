import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { 
  GoIssueTrackedBy, 
  GoHome 
} from "react-icons/go";
import { 
  RiTeamLine, 
  RiFolderWarningLine, 
  RiCommunityLine, 
  RiMenuLine, 
  RiCloseLine 
} from "react-icons/ri";
import { MdAssignment } from "react-icons/md";
import useRole from "../hooks/useRole";
import Logo from "../components/Logo/Logo";
import RouteTitle from "../components/RouteTitle/RouteTitle";

const DashBoardLayout = () => {
  const { role } = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper to standardise link styles
  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      onClick={closeSidebar}
      end={to === "/dashboard"} // Only exact match for root dashboard
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
          isActive
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      <Icon className="text-xl" />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <RouteTitle />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Logo />
            <button 
              onClick={closeSidebar}
              className="ml-auto lg:hidden text-gray-500 hover:text-gray-700"
            >
              <RiCloseLine size={24} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <NavItem to="/dashboard" icon={GoHome}>
              Overview
            </NavItem>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Management
              </p>
            </div>

            <NavItem to="/dashboard/my-issues" icon={GoIssueTrackedBy}>
              My Issues
            </NavItem>

            {role === "staff" && (
              <NavItem to="/dashboard/assigned-issues" icon={MdAssignment}>
                Assigned Issues
              </NavItem>
            )}

            {role === "admin" && (
              <>
                <NavItem to="/dashboard/manage-staff" icon={RiTeamLine}>
                  Manage Staff
                </NavItem>
                <NavItem to="/dashboard/all-issues" icon={RiFolderWarningLine}>
                  All Issues
                </NavItem>
                <NavItem to="/dashboard/manage-citizens" icon={RiCommunityLine}>
                  Manage Citizens
                </NavItem>
              </>
            )}
            
             <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                System
              </p>
            </div>
             <div className="px-4 py-3">
                 <Link to="/" className="btn btn-outline btn-sm w-full font-medium">
                     Back to Home
                 </Link>
             </div>
          </div>

          {/* User Profile / Footer (Optional - placeholder) */}
          <div className="p-4 border-t border-gray-100">
             {/* Could add mini user profile here */}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between sticky top-0 z-30">
          <Logo />
          <button 
            onClick={toggleSidebar}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RiMenuLine size={24} />
          </button>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashBoardLayout;
