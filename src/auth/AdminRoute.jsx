import React from "react";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/Loading/Loading";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import Forbidden from "../components/Forbidden/Forbidden";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role !== "admin") {
    return <Forbidden />;
  }

  return children;
};

export default AdminRoute;
