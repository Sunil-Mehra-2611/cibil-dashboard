import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User, type AuthState } from '../types/auth';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing token or session
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
            isLoading: false
          }));
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login({ email, password });
      
      // Handle the specific response structure provided by the user
      const { data } = response.data;
      const { access_token, userId, role, username } = data;
      
      const user: User = {
        id: userId.toString(),
        name: username || email.split('@')[0], // Use username if available, else fallback to email part
        email: email,
        role: role as 'admin' | 'user'
      };
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      setState({ 
        user, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err; // Re-throw to handle in the component if needed
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
