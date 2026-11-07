"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { api } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; role?: string }) => Promise<void>;
  logout: () => void;
  systemStatus: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    // Fetch system status
    api.getSystemStatus()
      .then(setSystemStatus)
      .catch((e) => console.log("System status check:", e));

    const storedToken = localStorage.getItem("aurex_token");
    if (storedToken) {
      setToken(storedToken);
      api.getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("aurex_token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem("aurex_token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (selectedRole: UserRole) => {
    const emailMap: Record<UserRole, string> = {
      admin: "admin@aurex.ai",
      creator: "creator@aurex.ai",
      reviewer: "reviewer@aurex.ai",
    };
    await login(emailMap[selectedRole], "aurex123");
  };

  const register = async (data: { email: string; password: string; full_name: string; role?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem("aurex_token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("aurex_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: (user?.role as UserRole) || "creator",
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        systemStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

