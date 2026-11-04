"use client";

import * as authService from "@/utils/authService";
import type { ApiErrorBody } from "@/types/api";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

/**
 * G2: Inloggningen ligger i en httpOnly-cookie som backend sätter.
 * Frontenden kan inte läsa cookien, så vid varje sidladdning frågar vi
 * backend "vem är inloggad?" (GET /auth/me). Svaret sparas här och
 * används av hela appen.
 */
type AuthContextState = {
  user: AuthUser | null;
  isPending: boolean;
  login: (email: string, password: string) => Promise<ApiErrorBody | null>;
  register: (email: string, password: string) => Promise<ApiErrorBody | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextState>({
  user: null,
  isPending: true,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
});

const networkError: ApiErrorBody = { message: "Could not reach the server" };

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setUser(await authService.getMe());
    } catch {
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login: AuthContextState["login"] = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (!result.ok) return result.error;
      setUser(result.data.user);
      return null;
    } catch {
      return networkError;
    }
  };

  const register: AuthContextState["register"] = async (email, password) => {
    try {
      const result = await authService.register(email, password);
      if (!result.ok) return result.error;
      if (!result.data.loggedIn) {
        return { message: "Account created. Confirm your email and then log in." };
      }
      setUser(result.data.user);
      return null;
    } catch {
      return networkError;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isPending, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
