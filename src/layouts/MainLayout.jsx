import React from "react";
import NavBar from "../components/NavBar/NavBar";
import { Outlet } from "react-router";
import Footer from "../components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import RouteTitle from "../components/RouteTitle/RouteTitle";

const MainLayout = () => {
  return (
    <div>
      <RouteTitle />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
