import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { LoginCredentials, RegisterData } from '../services/auth.service';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'patient' | 'pharmacy';
  phone_number: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) {
        try {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          AuthService.logout();
          setIsAuthenticated(false);
    }
      }
    setLoading(false);
    };

    initAuth();
  }, [isAuthenticated]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      await AuthService.login(credentials);
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to login');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      await AuthService.register(data);
      await login({ username: data.email, password: data.password });
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to register');
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};