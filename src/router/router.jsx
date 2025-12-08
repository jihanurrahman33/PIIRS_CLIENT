import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import Error404 from "../pages/Error/Error404";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import GetStarted from "../pages/Auth/GetStarted";

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
    ],
  },

  { path: "*", element: <Error404 /> },
]);
