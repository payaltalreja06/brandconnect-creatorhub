import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner"; // For notifications

export const API_URL = "http://localhost:5000/api/auth";

type UserRole = "influencer" | "brand" | null;

export interface UserProfile {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  handle?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  role: UserRole;
  userName: string;
  user: UserProfile | null;
  login: (token: string, userData: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  userName: "",
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check locally for a token
    const token = localStorage.getItem("auth_token");
    const storedUserStr = localStorage.getItem("auth_user");
    if (token && storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        setIsLoggedIn(true);
        setRole(storedUser.role);
        setUserName(storedUser.name);
        setUser(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  const login = (token: string, userData: UserProfile) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setRole(userData.role);
    setUserName(userData.name);
    setUser(userData);
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setIsLoggedIn(false);
    setRole(null);
    setUserName("");
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userName, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
