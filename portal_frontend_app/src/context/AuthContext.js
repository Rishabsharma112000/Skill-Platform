import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem("jwtToken", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
