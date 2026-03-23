import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaTable,
  FaLaptop,
  FaHandsHelping,
  FaMicrosoft,
  FaClipboardList,
  FaTools,
  FaDonate,
  FaUserPlus,
  FaInfo,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../utils/WVF_Logo.png";

// Separate LiveClock component
const LiveClock = React.memo(() => {
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ color: "#fff", marginRight: "20px" }}>
      <b>Time: </b>
      {currentTime}
    </span>
  );
});

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout successful");
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setMoreOpen(false);
    setUserOpen(false);
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  const activeItemStyle = {
    backgroundColor: "rgba(0, 82, 212, 0.2)",
  };

  // Header style
  const headerStyle = {
    background: "linear-gradient(to right, #0052D4, #4364F7, #6FB1FC)",
    padding: "0.2rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    minHeight: "50px",
  };

  return (
    <>
      <style>
        {`
          .navbar .dropdown-toggle::after {
            border-top-color: white !important;
          }
          .dropdown-item {
            transition: background-color 0.2s ease;
          }
          .navbar-nav {
            align-items: center;
          }
          .navbar-collapse {
            justify-content: flex-end;
          }
        `}
      </style>

      <Navbar expand="lg" style={headerStyle}>
        <Container fluid>
          <Navbar.Brand href="./dashboard">
            <img
              src={logo}
              alt="WinVinaya - Tasks Manager"
              style={{ height: "40px" }}
            />
          </Navbar.Brand>

          {!isAuthPage && isLoggedIn ? (
            <>
              <Navbar.Toggle aria-controls="main-navbar-nav" />
              <Navbar.Collapse id="main-navbar-nav">
                <Nav
                  className="ms-auto"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {/* Menu Dropdown */}
                  <NavDropdown
                    title={
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 500,
                          marginRight: "16px",
                        }}
                        aria-label="Main menu"
                      >
                        ☰ Menu
                      </span>
                    }
                    id="main-menu"
                    align="end"
                    show={menuOpen}
                    onToggle={() => {
                      setMenuOpen(!menuOpen);
                      setMoreOpen(false);
                      setUserOpen(false);
                    }}
                  >
                    <NavDropdown.Item
                      href="./dashboard"
                      style={isActiveRoute("/dashboard") ? activeItemStyle : {}}
                    >
                      <FaTachometerAlt
                        style={{ marginRight: "8px", color: "#0052D4" }}
                      />
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      href="./project-list"
                      style={isActiveRoute("/project-list") ? activeItemStyle : {}}
                    >
                      <FaTable
                        style={{ marginRight: "8px", color: "#0052D4" }}
                      />
                      Project List
                    </NavDropdown.Item>

                  </NavDropdown>

                  {/* Live Clock */}
                  <div style={{ marginRight: "20px" }}>
                    <LiveClock />
                  </div>

                  {/* User Dropdown */}
                  <NavDropdown
                    align="end"
                    id="user-dropdown"
                    title={
                      <img
                        src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                        alt="User avatar"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #fff",
                        }}
                      />
                    }
                    aria-label="User menu"
                    show={userOpen}
                    onToggle={() => {
                      setUserOpen(!userOpen);
                      setMenuOpen(false);
                      setMoreOpen(false);
                    }}
                    onSelect={(eventKey) => {
                      if (eventKey === "logout") {
                        handleLogout();
                        closeMenus();
                      }
                    }}
                  >
                    <NavDropdown.Item
                      href="./user-management"
                      style={
                        isActiveRoute("/user-management") ? activeItemStyle : {}
                      }
                    >
                      <FaUserPlus
                        style={{ marginRight: "8px", color: "#003A75" }}
                      />
                      User Management
                    </NavDropdown.Item>
                    <NavDropdown.Item eventKey="logout">
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : (
            <Nav className="ms-auto" style={{ alignItems: "center" }}>
              {location.pathname === "/login" && (
                <Nav.Link
                  // href="./signup"
                  style={authLinkStyle}
                  onMouseEnter={(e) => (e.target.style.background = "#5a86ff")}
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  {/* Sign Up */}
                </Nav.Link>
              )}

              {location.pathname === "/signup" && (
                <Nav.Link
                  href="./login"
                  style={authLinkStyle}
                  onMouseEnter={(e) => (e.target.style.background = "#5a86ff")}
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Login
                </Nav.Link>
              )}
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
}

const authLinkStyle = {
  color: "#fff",
  marginRight: "1rem",
  padding: "0.2rem 0.6rem",
  borderRadius: "4px",
  transition: "background 0.3s",
};

export default React.memo(Header);
