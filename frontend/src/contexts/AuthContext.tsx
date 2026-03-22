import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";

type UserRole = "influencer" | "brand" | null;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  setupComplete?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  role: UserRole;
  userName: string;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  userName: "",
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        const parsedUser: UserProfile = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setUserName(parsedUser.name);
        setIsLoggedIn(true);
        // Connect socket
        connectSocket(parsedUser.id);
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const setSession = (tokenVal: string, userVal: UserProfile) => {
    sessionStorage.setItem("token", tokenVal);
    sessionStorage.setItem("user", JSON.stringify(userVal));
    setToken(tokenVal);
    setUser(userVal);
    setIsLoggedIn(true);
    setRole(userVal.role);
    setUserName(userVal.name);
    connectSocket(userVal.id);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { token: t, user: u } = res.data;
    const profile: UserProfile = {
      id: u.id || u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      setupComplete: u.setupComplete,
    };
    setSession(t, profile);
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const res = await authApi.register({ name, email, password, role });
    const { token: t, user: u } = res.data;
    const profile: UserProfile = {
      id: u.id || u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      setupComplete: u.setupComplete,
    };
    setSession(t, profile);
  };

  const logout = () => {
    disconnectSocket();
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
    setUserName("");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userName, user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
