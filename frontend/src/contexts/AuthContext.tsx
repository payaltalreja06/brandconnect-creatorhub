import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "influencer" | "brand" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  role: UserRole;
  userName: string;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  userName: "",
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState("");

  const login = (r: UserRole, name: string) => {
    setIsLoggedIn(true);
    setRole(r);
    setUserName(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
