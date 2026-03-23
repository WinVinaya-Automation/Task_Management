import React from "react";
import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const isLoggedIn = !!localStorage.getItem("token"); // or use your actual auth logic

  return <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />;
};

export default HomeRedirect;
