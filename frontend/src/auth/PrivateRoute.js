// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { verifyToken } from "../services/auth-api";

// const PrivateRoute = ({ children, roles }) => {
//   const [valid, setValid] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return setValid(false);

//     verifyToken(token)
//       .then((data) => setValid(data.valid))
//       .catch(() => setValid(false));
//   }, []);

//   if (valid === null) return <p>Loading...</p>;

//   const userRole = localStorage.getItem("role");

//   // If not valid or role mismatch
//   if (!valid) return <Navigate to="/login" />;
//   if (roles && !roles.includes(userRole)) return <Navigate to="/dashboard" />;

//   return children;
// };

// export default PrivateRoute;

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verifyToken } from "../services/auth-api";
import { toast } from "react-toastify";

const spinnerStyle = {
  display: "inline-block",
  width: "50px",
  height: "50px",
  border: "4px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  borderTopColor: "#3498db",
  animation: "spin 1s linear infinite",
  margin: "50px auto",
};

const spinnerContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
  flexDirection: "column",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: "#333",
};

const spinnerKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

const PrivateRoute = ({ children, allowedRoles }) => {
  const [valid, setValid] = useState(null);
  const [showRedirect, setShowRedirect] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setValid(false);
      return;
    }

    verifyToken(token)
      .then((data) => setValid(data.valid))
      .catch(() => setValid(false));
  }, []);

  if (valid === null)
    return (
      <>
        <style>{spinnerKeyframes}</style>
        <div style={spinnerContainer}>
          <div style={spinnerStyle} />
          <p>
            <b>Loading, please wait...</b>
          </p>
        </div>
      </>
    );

  const userRole = (localStorage.getItem("role") || "").toLowerCase();

  if (!valid) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (!showRedirect) {
      const moduleName = location.pathname.replace(/\//g, " ").trim();
      toast.error(`Only Admin role can access: ${moduleName}`);
      setShowRedirect(true);
    }
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
