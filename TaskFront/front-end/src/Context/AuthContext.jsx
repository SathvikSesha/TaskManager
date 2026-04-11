import { useState, createContext, useContext, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const loading = false;

  const login = useCallback((data) => {
    setUser(data);
    sessionStorage.setItem("user", JSON.stringify(data));
  }, []);

  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(partial || {}) };
      sessionStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
