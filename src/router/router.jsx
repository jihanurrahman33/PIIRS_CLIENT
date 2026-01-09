import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import Error404 from "../pages/Error/Error404";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import GetStarted from "../pages/Auth/GetStarted";
import Issues from "../pages/Issues/Issues";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import ReportIssue from "../pages/ReportIssue/ReportIssue";
import PrivateRoute from "../auth/PrivateRoute";
import DashBoardLayout from "../layouts/DashBoardLayout";
import Profile from "../pages/Dashboard/Citizen/Profile/Profile";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues/MyIssues";
import IssueDetails from "../components/IssueDetails/IssueDetails";
import ManageStaff from "../pages/Dashboard/Admin/ManageStaff/ManageStaff";
import AssignedIssues from "../pages/Dashboard/Staff/AssignedIssues/AssignedIssues";
import StaffRoute from "../auth/StaffRoute";
import AdminRoute from "../auth/AdminRoute";
import AllIssues from "../pages/Dashboard/Admin/AllIssues/AllIssues";
import ManageCitizens from "../pages/Dashboard/Admin/ManageCitizens/ManageCitizens";
import DashBoard from "../pages/Dashboard/DashBoard/DashBoard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: { title: "Home" },
      },
      {
        path: "get-started",
        Component: GetStarted,
        handle: { title: "Get Started" },
      },
      {
        path: "login",
        Component: Login,
        handle: { title: "Login" },
      },
      {
        path: "register",
        Component: Register,
        handle: { title: "Register" },
      },
      {
        path: "all-issues",
        element: <Issues />,
        handle: { title: "All Issues" },
      },
      {
        path: "about",
        element: <About />,
        handle: { title: "About" },
      },
      {
        path: "contact",
        element: <Contact />,
        handle: { title: "Contact" },
      },
      {
        path: "report-issue",
        element: (
          <PrivateRoute>
            <ReportIssue />
          </PrivateRoute>
        ),
        handle: { title: "Report Issue" },
      },
      {
        path: "issue-details/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
        handle: { title: "Issue Details" },
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoardLayout></DashBoardLayout>
      </PrivateRoute>
    ),
    handle: { title: "Dashboard" },
    children: [
      {
        index: true,
        element: <DashBoard></DashBoard>,
        handle: { title: "Dashboard" },
      },
      {
        path: "profile",
        element: <Profile></Profile>,
        handle: { title: "Profile" },
      },
      {
        path: "my-issues",
        element: <MyIssues></MyIssues>,
        handle: { title: "My Issues" },
      },
      {
        path: "manage-staff",
        element: (
          <AdminRoute>
            <ManageStaff></ManageStaff>
          </AdminRoute>
        ),
        handle: { title: "Manage Staff" },
      },
      {
        path: "manage-citizens",
        element: (
          <AdminRoute>
            <ManageCitizens></ManageCitizens>
          </AdminRoute>
        ),
        handle: { title: "Manage Citizens" },
      },
      {
        path: "all-issues",
        element: (
          <AdminRoute>
            <AllIssues></AllIssues>
          </AdminRoute>
        ),
        handle: { title: "All Issues" },
      },
      {
        path: "assigned-issues",
        element: (
          <StaffRoute>
            <AssignedIssues></AssignedIssues>
          </StaffRoute>
        ),
        handle: { title: "Assigned Issues" },
      },
    ],
  },

  { path: "*", element: <Error404 /> },
]);
