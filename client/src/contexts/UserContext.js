// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { login as apiLogin } from "../ApiRequest";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username"); // optional
    if (token) {
      setUser({ token, username });
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    await apiLogin(username, password);
    const token = localStorage.getItem("token");
    setUser({ token, username });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  return useContext(UserContext);
}
