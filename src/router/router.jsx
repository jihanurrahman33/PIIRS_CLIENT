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
    ],
  },

  { path: "*", element: <Error404 /> },
]);
