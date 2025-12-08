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
    path: "/Dashboard",
    element: (
      <PrivateRoute>
        <DashBoardLayout></DashBoardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "my-issues",
        element: <MyIssues></MyIssues>,
      },
    ],
  },

  { path: "*", element: <Error404 /> },
]);
