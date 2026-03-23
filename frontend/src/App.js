import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Essential for react-toastify default styles

// Import global styles for application-wide layout and common elements
import "./styles/global.css";

// Authentication & Core Components
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";
import HomeRedirect from "./components/pages/HomeRedirect";
import NotFound from "./components/common/NotFound";
// Common Layout Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
//NA
import Dashboard from "./components/pages/Dashboard";
import UserManagement from "./components/pages/UserManagement";
import InfoDetails from "./components/pages/InfoDetails";
//Changed
import AssetList from "./components/pages/AssetDetails/AssetsList";
import AssetLaptopConfigList from "./components/pages/AssetLoptopConfigDetails/AssetLaptopConfigList";
import DonorDetailsList from "./components/pages/AssetDonorDetails/AssetDonorDetailsList";
import AssetAssignedDetailsList from "./components/pages/AssetAssignedDetails/AssetAssignedDetailsList";
import AssetServiceDetailsList from "./components/pages/AssetServiceDetails/AssetServiceDetailsList";
import WvfdonorDetailsList from "./components/pages/AssetWVFDonorDetails/WVFDonorDetailsList";
import MSOfficeDetailsList from "./components/pages/AssetMSOfficeDetails/MSOfficeDetailsList";

function App() {
  return (
    <Router basename="/asset-management">
      {/* Persistent Header */}
      <header className="app-header">
        {" "}
        {/* Uses class from global.css */}
        <Header />
      </header>

      {/* Main content area */}
      <main className="app-main" tabIndex={-1}>
        {" "}
        {/* Uses class from global.css */}
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/assetlist"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <AssetList />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/info-details"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <InfoDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/laptop-Conf-list"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <AssetLaptopConfigList />
              </PrivateRoute>
            }
          />
          <Route
            path="/donor-list"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <DonorDetailsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/msoffice-details"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <MSOfficeDetailsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/asset-assigned-details"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <AssetAssignedDetailsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/service-details"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <AssetServiceDetailsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/wvf-donor-details"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <WvfdonorDetailsList />
              </PrivateRoute>
            }
          />
          {/* Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Persistent Footer */}
      <footer className="app-footer">
        {" "}
        {/* Uses class from global.css */}
        <Footer />
      </footer>

      {/* Toast notifications */}
      <ToastContainer
        pauseOnHover={false}
        closeButton={false}
        closeOnClick={false}
        draggable={false}
        position="top-right"
        autoClose={2000}
        ariaLive="polite"
      />
    </Router>
  );
}

export default App;
