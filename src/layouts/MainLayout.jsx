import React from "react";
import NavBar from "../components/NavBar/NavBar";
import { Outlet } from "react-router";
import Footer from "../components/Footer/Footer";

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
