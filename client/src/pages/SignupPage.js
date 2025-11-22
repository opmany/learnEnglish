// src/pages/Signup.jsx
import React from "react";
import { useNavigate } from "react-router";
import AuthForm from "../components/AuthForm";
import { signup } from "../ApiRequest";
import { useUser } from "../contexts/UserContext";

export default function Signup() {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSignup = async ({ username, email, password }) => {
    await signup(username, password, email);
    // auto-login
    await login(username, password);
    navigate("/");
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}
