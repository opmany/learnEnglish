import React, { useState } from "react";
import { Card, Form, Button, Alert, InputGroup, Toast, ToastContainer } from "react-bootstrap";
import { PersonFill, EnvelopeFill, LockFill, EyeFill } from "react-bootstrap-icons";

export default function AuthForm({ type = "login", onSubmit }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      await onSubmit({ username, email, password });
      setToastMessage(type === "signup" ? "Signup successful! Logging you in..." : "Login successful!");
      setShowToast(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <Card className="p-4 shadow-lg rounded-4" style={{ width: "420px", backgroundColor: "#ffffffcc" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: "#2575fc" }}>Learning English</h2>
          <p className="text-muted">{type === "login" ? "Login to your account" : "Create a new account"}</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <InputGroup>
              <InputGroup.Text><PersonFill /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          {type === "signup" && (
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text><EnvelopeFill /></InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text><LockFill /></InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text
                style={{ cursor: "pointer" }}
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                title="Hold to show password"
              >
                <EyeFill />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button
            variant={type === "login" ? "primary" : "success"}
            className="w-100 fw-bold shadow-sm"
            onClick={handleSubmit}
          >
            {type === "login" ? "Login" : "Sign Up"}
          </Button>
        </Form>
      </Card>

      <ToastContainer position="top-center" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2000}
          autohide
          bg="success"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
