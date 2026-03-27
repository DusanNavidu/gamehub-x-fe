import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API call nathuwa kelinma local storage eken gannawa
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");

    if (token && role) {
      setUser({ id, role, token });
    } else {
      setUser(null);
    }
    
    setLoading(false); // Kelinma false karanawa api load wenakan inna oni nathi nisa
  }, []);

  // Logout function eka methanama damma, lesi wenna
  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};