import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, checkUserExists, resetPassword } from "../services/auth-api";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Password reset states
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetUser, setResetUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1: verify user, 2: reset password
  const [resetLoading, setResetLoading] = useState(false);

  const requiredFieldsToastId = useRef(null);
  const navigate = useNavigate();

  // Login form validation
  const validateLoginForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form validation
  const validateResetForm = () => {
    const newErrors = {};
    if (resetStep === 1 && !resetUser.trim()) {
      newErrors.resetUser = "Please enter username or email";
    }
    if (resetStep === 2 && !newPassword.trim()) {
      newErrors.newPassword = "Please enter new password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submit
  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateLoginForm()) {
      if (!requiredFieldsToastId.current) {
        requiredFieldsToastId.current = toast.error(
          "Please fill all required fields."
        );
      }
      return;
    }
    toast.dismiss(requiredFieldsToastId.current);
    requiredFieldsToastId.current = null;

    setLoading(true);
    toast.dismiss();

    try {
      const res = await login(username, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        toast.success("Login successful!", {
          autoClose: 2000,
          closeButton: false,
          closeOnClick: false,
          draggable: false,
          pauseOnHover: false,
          onClose: () => {
            setLoading(false);
            navigate("/dashboard");
          },
        });
      } else {
        toast.error(res.error || "Login failed.", {
          autoClose: 2000,
          closeButton: false,
          closeOnClick: false,
          draggable: false,
          pauseOnHover: false,
          onClose: () => setLoading(false),
        });
      }
    } catch (err) {
      toast.error("Login failed. Try again.", {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: false,
        onClose: () => setLoading(false),
      });
    }
  };

  // Handle password reset submit
  const handleResetSubmit = async (event) => {
    event.preventDefault();

    if (!validateResetForm()) return;

    setResetLoading(true);
    try {
      if (resetStep === 1) {
        // Verify user exists
        const data = await checkUserExists(resetUser);
        if (data.exists) {
          setResetStep(2);
          setErrors({});
        } else {
          toast.error("Username or email not found.");
        }
      } else if (resetStep === 2) {
        // Reset password
        const data = await resetPassword(resetUser, newPassword);
        if (data.message) {
          toast.success("Password updated successfully! You can login now.");
          setShowResetForm(false);
          setResetStep(1);
          setResetUser("");
          setNewPassword("");
          setErrors({});
        } else {
          toast.error(data.error || "Failed to reset password.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // Handle input changes with error clearing
  const handleChange = (setter, key) => (e) => {
    setter(e.target.value);
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          textAlign: "center",
          margin: "1rem 0",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: -100,
          marginTop: 25,
          color: "#003366",
        }}
      >
        WinVinaya Tasks Management
      </div>
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
        <Row style={{ width: "75%" }}>
          <Col md={{ span: 6, offset: 3 }}>
            {/* Login Form */}
            {!showResetForm && (
              <div
                className="p-4 shadow rounded"
                style={{ backgroundColor: "#fff" }}
              >
                <h3
                  className="text-center mb-3"
                  tabIndex={0}
                  style={{ color: "#003366" }}
                >
                  Login
                </h3>
                <Form onSubmit={handleLogin} aria-label="Login Form">
                  <Form.Group className="mb-3" controlId="usernameInput">
                    <Form.Label style={{ color: "#003366" }}>
                      User Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={handleChange(setUsername, "username")}
                      isInvalid={!!errors.username}
                      disabled={loading}
                      aria-describedby="usernameError"
                      aria-invalid={!!errors.username}
                      aria-required="true"
                      autoComplete="username"
                      title="Enter your username"
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      id="usernameError"
                      role="alert"
                    >
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="passwordInput">
                    <Form.Label style={{ color: "#003366" }}>
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={handleChange(setPassword, "password")}
                      isInvalid={!!errors.password}
                      disabled={loading}
                      aria-describedby="passwordError"
                      aria-invalid={!!errors.password}
                      aria-required="true"
                      autoComplete="current-password"
                      title="Enter your password"
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      id="passwordError"
                      role="alert"
                    >
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" className="w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      onClick={() => setShowResetForm(true)}
                      style={{
                        color: "#003366",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        padding: 0,
                      }}
                      disabled={loading}
                    >
                      Reset Password
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {/* Password Reset Form */}
            {showResetForm && (
              <div
                className="p-4 shadow rounded"
                style={{ backgroundColor: "#fff" }}
              >
                <h3
                  className="text-center mb-3"
                  tabIndex={0}
                  style={{ color: "#003366" }}
                >
                  Password Reset
                </h3>
                <Form
                  onSubmit={handleResetSubmit}
                  aria-label="Password Reset Form"
                >
                  {resetStep === 1 && (
                    <Form.Group className="mb-3" controlId="resetUserInput">
                      <Form.Label style={{ color: "#003366" }}>
                        Enter Username or Email
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Username or Email"
                        value={resetUser}
                        onChange={handleChange(setResetUser, "resetUser")}
                        isInvalid={!!errors.resetUser}
                        disabled={resetLoading}
                        aria-describedby="resetUserError"
                        aria-invalid={!!errors.resetUser}
                        aria-required="true"
                        autoComplete="username"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        id="resetUserError"
                        role="alert"
                      >
                        {errors.resetUser}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                  {resetStep === 2 && (
                    <Form.Group className="mb-3" controlId="newPasswordInput">
                      <Form.Label style={{ color: "#003366" }}>
                        Enter New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={handleChange(setNewPassword, "newPassword")}
                        isInvalid={!!errors.newPassword}
                        disabled={resetLoading}
                        aria-describedby="newPasswordError"
                        aria-invalid={!!errors.newPassword}
                        aria-required="true"
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        id="newPasswordError"
                        role="alert"
                      >
                        {errors.newPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}

                  <Button
                    type="submit"
                    className="w-100"
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        {resetStep === 1 ? "Checking..." : "Resetting..."}
                      </>
                    ) : resetStep === 1 ? (
                      "Verify User"
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      onClick={() => {
                        setShowResetForm(false);
                        setResetStep(1);
                        setResetUser("");
                        setNewPassword("");
                        setErrors({});
                      }}
                      disabled={resetLoading}
                      style={{
                        color: "#003366",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        padding: 0,
                      }}
                    >
                      Back to Login
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
