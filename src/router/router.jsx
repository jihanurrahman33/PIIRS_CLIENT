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
      },
      {
        path: "get-started",
        Component: GetStarted,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "all-issues",
        element: <Issues />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "report-issue",
        element: (
          <PrivateRoute>
            <ReportIssue />
          </PrivateRoute>
        ),
      },
      {
        path: "issue-details/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
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
    children: [
      {
        index: true,
        element: <DashBoard></DashBoard>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "my-issues",
        element: <MyIssues></MyIssues>,
      },
      {
        path: "manage-staff",
        element: (
          <AdminRoute>
            <ManageStaff></ManageStaff>
          </AdminRoute>
        ),
      },
      {
        path: "manage-citizens",
        element: (
          <AdminRoute>
            <ManageCitizens></ManageCitizens>
          </AdminRoute>
        ),
      },
      {
        path: "all-issues",
        element: (
          <AdminRoute>
            <AllIssues></AllIssues>
          </AdminRoute>
        ),
      },
      {
        path: "assigned-issues",
        element: (
          <StaffRoute>
            <AssignedIssues></AssignedIssues>
          </StaffRoute>
        ),
      },
    ],
  },

  { path: "*", element: <Error404 /> },
]);
