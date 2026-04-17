'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';
import { getUser, setUser, setTokens, clearTokens } from '@/lib/auth-storage';
import type { IAuthResponseDto, IAuthUser } from '@/interfaces/IAuth';

interface IAuthContextValue {
  user: IAuthUser | null;
  isLoading: boolean;
  login: (data: IAuthResponseDto) => void;
  logout: () => void;
  updateUser: (user: IAuthUser, token: string, refreshToken: string) => void;
}

type AuthState = { user: IAuthUser | null; isLoading: boolean };
type AuthAction =
  | { type: 'HYDRATE'; user: IAuthUser | null }
  | { type: 'SET_USER'; user: IAuthUser }
  | { type: 'CLEAR_USER' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'HYDRATE':
      return { user: action.user, isLoading: false };
    case 'SET_USER':
      return { user: action.user, isLoading: false };
    case 'CLEAR_USER':
      return { user: null, isLoading: false };
  }
};

const AuthContext = createContext<IAuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ user, isLoading }, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    dispatch({ type: 'HYDRATE', user: getUser() });
  }, []);

  const login = (data: IAuthResponseDto) => {
    const authUser: IAuthUser = { email: data.email, displayName: data.displayName };
    setTokens(data.token, data.refreshToken);
    setUser(authUser);
    dispatch({ type: 'SET_USER', user: authUser });
  };

  const logout = () => {
    clearTokens();
    dispatch({ type: 'CLEAR_USER' });
  };

  const updateUser = (updatedUser: IAuthUser, token: string, refreshToken: string) => {
    setTokens(token, refreshToken);
    setUser(updatedUser);
    dispatch({ type: 'SET_USER', user: updatedUser });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
