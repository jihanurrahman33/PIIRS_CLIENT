import React from "react";
import useRole from "../../../hooks/useRole";
import Loading from "../../../components/Loading/Loading";
import Forbidden from "../../../components/Forbidden/Forbidden";
import AdminDashBoard from "../Admin/AdminDashBoard/AdminDashBoard";
import StaffDashBoard from "../Staff/StaffDashBoard/StaffDashBoard";
import CitizenDashBoard from "../Citizen/CitizenDashBoard/CitizenDashBoard";

const DashBoard = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) return <Loading></Loading>;
  if (!role) {
    return <Forbidden></Forbidden>;
  }
  if (role === "admin") {
    return <AdminDashBoard></AdminDashBoard>;
  }
  if (role === "staff") {
    return <StaffDashBoard></StaffDashBoard>;
  } else {
    return <CitizenDashBoard></CitizenDashBoard>;
  }
};

export default DashBoard;
