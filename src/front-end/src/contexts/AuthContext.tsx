"use client";

import { routes } from "@/constants/api-routes";
import { publicPaths } from "@/constants/app-paths";
import { api } from "@/api/api";
import { ApiError } from "@/types/Error";
import { LoggedUser } from "@/types/User";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createContext, ReactNode, useEffect, useState } from "react";
import { persistAuthSession } from "@/utils/auth";

interface AuthContextValues {
  user: LoggedUser | null;
  setUser: (user: LoggedUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadingAuth: boolean;
  isLoggingIn: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValues>(
  {} as AuthContextValues,
);

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  async function loadUser() {
    try {
      const response = await api.get(routes.users.get);
      setUser(response.data);
    } catch (error) {
      setUser(null);
      if (!publicPaths.includes(window.location.pathname)) navigate("/login");
    } finally {
      setLoadingAuth(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoadingAuth(true);
      setIsLoggingIn(true);

      const response = await api.post(routes.auth.login, { email, password });
      
      persistAuthSession(response.data);
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      console.log(response);

      const userData: LoggedUser = response.data.user;
      setUser(userData);

      navigate("/home?login=true");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        console.log(error.response.data);
        throw new ApiError(error.response.data);
      }

      throw error;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function logout() {
    setUser(null);
    try {
      setLoadingAuth(true);
      const response = await api.post(routes.auth.logout);

      if (response.status === 204) {
        setUser(null);
        navigate("/login?logout=true");
      } else {
        throw new ApiError(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new ApiError(error.response.data);
      }

      throw error;
    } finally {
      setLoadingAuth(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loadingAuth, isLoggingIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
