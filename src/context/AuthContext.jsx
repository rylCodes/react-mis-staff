import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const currentId = localStorage.getItem("user_id");
    token && setAuthToken(token);
    currentId && setUserId(currentId);
  }, []);

  const login = (token, userId) => {
    setAuthToken(token);
    setUserId(userId);
    localStorage.setItem("access_token", token);
    localStorage.setItem("access_token", token);
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
