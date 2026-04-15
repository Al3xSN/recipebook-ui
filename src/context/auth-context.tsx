'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';
import { getUser, setUser, setTokens, clearTokens } from '@/lib/auth-storage';
import type { AuthResponseDto, AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: AuthResponseDto) => void;
  logout: () => void;
  updateUser: (user: AuthUser, token: string, refreshToken: string) => void;
}

type AuthState = { user: AuthUser | null; isLoading: boolean };
type AuthAction =
  | { type: 'HYDRATE'; user: AuthUser | null }
  | { type: 'SET_USER'; user: AuthUser }
  | { type: 'CLEAR_USER' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'HYDRATE':
      return { user: action.user, isLoading: false };
    case 'SET_USER':
      return { user: action.user, isLoading: false };
    case 'CLEAR_USER':
      return { user: null, isLoading: false };
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, isLoading }, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    dispatch({ type: 'HYDRATE', user: getUser() });
  }, []);

  function login(data: AuthResponseDto) {
    const authUser: AuthUser = { email: data.email, displayName: data.displayName };
    setTokens(data.token, data.refreshToken);
    setUser(authUser);
    dispatch({ type: 'SET_USER', user: authUser });
  }

  function logout() {
    clearTokens();
    dispatch({ type: 'CLEAR_USER' });
  }

  function updateUser(updatedUser: AuthUser, token: string, refreshToken: string) {
    setTokens(token, refreshToken);
    setUser(updatedUser);
    dispatch({ type: 'SET_USER', user: updatedUser });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
