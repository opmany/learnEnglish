// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router";
import AuthForm from "../components/AuthForm";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const { user, logout, login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    await login(username, password);
    navigate("/");
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
