import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("assetportal_user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("assetportal_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then(res => {
        setUser(res.data.user);
        localStorage.setItem("assetportal_user", JSON.stringify(res.data.user));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const login = async credentials => {
    const res = await api.post("/auth/login", credentials);
    localStorage.setItem("assetportal_token", res.data.token);
    localStorage.setItem("assetportal_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const register = async payload => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("assetportal_token", res.data.token);
    localStorage.setItem("assetportal_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  function logout() {
    localStorage.removeItem("assetportal_token");
    localStorage.removeItem("assetportal_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
