// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signup } from "../services/auth-api";
// import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";

function Signup() {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [role, setRole] = useState("");
  // const [errors, setErrors] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [toastId, setToastId] = useState(null);
  // const navigate = useNavigate();

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!username.trim()) newErrors.username = "Username is required";
  //   if (!email.trim()) newErrors.email = "Email is required";
  //   if (!password.trim()) newErrors.password = "Password is required";
  //   if (!role.trim()) newErrors.role = "Role is required";
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSignup = async (event) => {
  //   event.preventDefault();

  //   if (!validateForm()) {
  //     if (!toast.isActive(toastId)) {
  //       const id = toast.error("Please fill all required fields.");
  //       setToastId(id);
  //     }
  //     setLoading(false);
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const res = await signup(username, email, password, role);
  //     if (res.message) {
  //       toast.success("Signup successful!", {
  //         autoClose: 2000,
  //         closeButton: false,
  //         closeOnClick: false,
  //         draggable: false,
  //         pauseOnHover: false,
  //         onClose: () => {
  //           setLoading(false);
  //           navigate("/login");
  //         },
  //       });
  //     } else {
  //       toast.error(res.error || "Signup failed.", {
  //         autoClose: false,
  //         closeButton: false,
  //         closeOnClick: false,
  //         draggable: false,
  //         pauseOnHover: false,
  //       });
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     toast.error("Signup failed. Try again.", {
  //       autoClose: false,
  //       closeButton: false,
  //       closeOnClick: false,
  //       draggable: false,
  //       pauseOnHover: false,
  //     });
  //     setLoading(false);
  //   }
  // };

  // const handleChange = (setter, key) => (e) => {
  //   setter(e.target.value);

  //   if (errors[key]) {
  //     const newErrors = { ...errors, [key]: null };
  //     setErrors(newErrors);

  //     if (Object.values(newErrors).every((v) => !v)) {
  //       if (toastId) {
  //         toast.dismiss(toastId);
  //         setToastId(null);
  //       }
  //     }
  //   }
  // };

  // return (
  //   <div
  //     style={{
  //       minHeight: "80vh",
  //       display: "flex",
  //       flexDirection: "column",
  //       backgroundColor: "#f5f8fa",
  //     }}
  //   >
  //     <Container className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
  //       {/* Title */}
  //       <div
  //         style={{
  //           textAlign: "center",
  //           fontSize: "2rem",
  //           fontWeight: "bold",
  //           marginTop: "-1rem",
  //           marginBottom: "2rem",
  //           color: "#003366",
  //         }}
  //       >
  //         WinVinaya Assets Management
  //       </div>

  //       {/* Signup Card */}
  //       <div
  //         className="shadow p-4 rounded"
  //         style={{
  //           backgroundColor: "#fff",
  //           width: "100%",
  //           maxWidth: "500px",
  //           border: "1px solid #dee2e6",
  //         }}
  //       >
  //         <h4
  //           className="text-center mb-4"
  //           style={{ color: "#003366", fontWeight: "600" }}
  //         >
  //           Create Your Account
  //         </h4>

  //         <Form onSubmit={handleSignup} aria-label="Signup Form">
  //           <Row className="g-3">
  //             <Col md={6}>
  //               <Form.Group controlId="usernameInput">
  //                 <Form.Label style={{ color: "#003366" }}>
  //                   User Name
  //                 </Form.Label>
  //                 <Form.Control
  //                   type="text"
  //                   placeholder="Enter your username"
  //                   value={username}
  //                   onChange={handleChange(setUsername, "username")}
  //                   isInvalid={!!errors.username}
  //                   disabled={loading}
  //                   autoComplete="username"
  //                   aria-describedby="usernameError"
  //                   aria-invalid={!!errors.username}
  //                   aria-required="true"
  //                 />
  //                 <Form.Control.Feedback
  //                   type="invalid"
  //                   id="usernameError"
  //                   role="alert"
  //                 >
  //                   {errors.username}
  //                 </Form.Control.Feedback>
  //               </Form.Group>
  //             </Col>

  //             <Col md={6}>
  //               <Form.Group controlId="emailInput">
  //                 <Form.Label style={{ color: "#003366" }}>Email</Form.Label>
  //                 <Form.Control
  //                   type="email"
  //                   placeholder="Enter your email"
  //                   value={email}
  //                   onChange={handleChange(setEmail, "email")}
  //                   isInvalid={!!errors.email}
  //                   disabled={loading}
  //                   autoComplete="email"
  //                   aria-describedby="emailError"
  //                   aria-invalid={!!errors.email}
  //                   aria-required="true"
  //                 />
  //                 <Form.Control.Feedback
  //                   type="invalid"
  //                   id="emailError"
  //                   role="alert"
  //                 >
  //                   {errors.email}
  //                 </Form.Control.Feedback>
  //               </Form.Group>
  //             </Col>

  //             <Col md={6}>
  //               <Form.Group controlId="passwordInput">
  //                 <Form.Label style={{ color: "#003366" }}>Password</Form.Label>
  //                 <Form.Control
  //                   type="password"
  //                   placeholder="Enter your password"
  //                   value={password}
  //                   onChange={handleChange(setPassword, "password")}
  //                   isInvalid={!!errors.password}
  //                   disabled={loading}
  //                   autoComplete="new-password"
  //                   aria-describedby="passwordError"
  //                   aria-invalid={!!errors.password}
  //                   aria-required="true"
  //                 />
  //                 <Form.Control.Feedback
  //                   type="invalid"
  //                   id="passwordError"
  //                   role="alert"
  //                 >
  //                   {errors.password}
  //                 </Form.Control.Feedback>
  //               </Form.Group>
  //             </Col>

  //             <Col md={6}>
  //               <Form.Group controlId="roleInput">
  //                 <Form.Label style={{ color: "#003366" }}>
  //                   User Role
  //                 </Form.Label>
  //                 <Form.Select
  //                   value={role}
  //                   onChange={handleChange(setRole, "role")}
  //                   isInvalid={!!errors.role}
  //                   disabled={loading}
  //                   aria-describedby="roleError"
  //                   aria-invalid={!!errors.role}
  //                   aria-required="true"
  //                 >
  //                   <option value="">Select Role</option>
  //                   <option value="admin">Admin</option>
  //                   <option value="employee">Employee</option>
  //                 </Form.Select>
  //                 <Form.Control.Feedback
  //                   type="invalid"
  //                   id="roleError"
  //                   role="alert"
  //                 >
  //                   {errors.role}
  //                 </Form.Control.Feedback>
  //               </Form.Group>
  //             </Col>

  //             <Col xs={12}>
  //               <Button
  //                 type="submit"
  //                 className="w-100"
  //                 // style={{ backgroundColor: "#003366", borderColor: "#003366" }}
  //                 disabled={loading}
  //               >
  //                 {loading ? (
  //                   <>
  //                     <Spinner
  //                       as="span"
  //                       animation="border"
  //                       size="sm"
  //                       role="status"
  //                       aria-hidden="true"
  //                       className="me-2"
  //                       style={{ color: "#fff" }}
  //                     />
  //                     Signing up...
  //                   </>
  //                 ) : (
  //                   "Sign Up"
  //                 )}
  //               </Button>
  //             </Col>
  //           </Row>
  //         </Form>
  //       </div>
  //     </Container>
  //     <ToastContainer />
  //   </div>
  // );
  return (
    <div
      style={{
        minHeight: "55vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f8fa",
      }}
    >
      <Container className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginTop: "-1rem",
            marginBottom: "3rem",
            color: "#003366",
          }}
        >
          WinVinaya Assets Management
        </div>

        {/* Info Message Card */}
        <div
          className="shadow p-4 rounded text-center"
          style={{
            backgroundColor: "#fff",
            width: "100%",
            maxWidth: "500px",
            border: "1px solid #dee2e6",
          }}
        >
          <h4 className="mb-3" style={{ color: "#003366", fontWeight: "600" }}>
            Signup Restricted
          </h4>
          <p style={{ fontSize: "1.1rem", color: "#333" }}>
            Please contact the admin to create an account and get your login
            credentials.
          </p>
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default Signup;
