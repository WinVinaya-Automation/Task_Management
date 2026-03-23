import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles/global.css";

import Signup from "./auth/Signup";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";
import HomeRedirect from "./components/pages/HomeRedirect";
import NotFound from "./components/common/NotFound";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Dashboard from "./components/pages/Dashboard";
import UserManagement from "./components/pages/UserManagement";
import ProjectsList from "./components/pages/Project/ProjectsList";
import ProjectDetailPage from "./components/pages/ProjectDetailPage";

function App() {
  return (
    <Router basename="/task-management">
      <header className="app-header">
        <Header />
      </header>

      <main className="app-main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
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
            path="/project-list"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <ProjectsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute allowedRoles={["admin", "employee"]}>
                <ProjectDetailPage />
              </PrivateRoute>
            } />
          {/* Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <Footer />
      </footer>

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
